
import React, { createContext, useState, useEffect, useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from './AuthProvider';

export const LeadsContext = createContext<any>(null);

export const LeadsProvider = ({ children }: any) => {
    const [leads, setLeads] = useState<any[]>([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.uid) {
            const subscriber = firestore()
                .collection('Leads')
                .where('userId', '==', user.uid)
                .orderBy('createdAt', 'desc')
                .limit(50)
                .onSnapshot(
                    querySnapshot => {
                        if (!querySnapshot) return;

                        const leadsData: any[] = [];
                        querySnapshot.forEach(doc => {
                            const data = doc.data();
                            if (!data.createdAt) {
                                data.createdAt = firestore.Timestamp.now();
                            }
                            leadsData.push({
                                ...data,
                                id: doc.id,
                            });
                        });

                        setLeads(leadsData);
                    },
                    error => {
                        console.error('Firestore onSnapshot error:', error);
                    }
                );

            return () => subscriber();
        }
    }, [user]);

    const addLead = async (newLead: any) => {
        try {
            await firestore().collection('Leads').add({
                ...newLead,
                userId: user?.uid,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
            console.error('Error adding lead: ', error);
        }
    };

    const deleteLead = async (leadId: string) => {
        try {
            const followUpsSnapshot = await firestore()
                .collection('Leads')
                .doc(leadId)
                .collection('FollowUps')
                .get();

            const batch = firestore().batch();
            followUpsSnapshot.forEach(doc => batch.delete(doc.ref));
            batch.delete(firestore().collection('Leads').doc(leadId));
            await batch.commit();
        } catch (error) {
            console.error('Delete Error: ', error);
        }
    };

    const updateLead = async (leadId: string, updatedData: any) => {
        try {
            await firestore().collection('Leads').doc(leadId).update(updatedData);
        } catch (error) {
            console.error('Update Error: ', error);
        }
    };

    const closeLead = async (leadId: string) => {
        try {
            await firestore().collection('Leads').doc(leadId).update({
                status: 'Closed',
                closedAt: firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
            console.error('Close Error: ', error);
        }
    };

    const addFollowUp = async (leadId: string, entry: any) => {
        try {
            await firestore()
                .collection('Leads')
                .doc(leadId)
                .collection('FollowUps')
                .add({
                    ...entry,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
        } catch (error) {
            console.error('Error adding followup: ', error);
        }
    };

    const deleteFollowUp = async (leadId: string, followUpId: string) => {
        try {
            await firestore()
                .collection('Leads')
                .doc(leadId)
                .collection('FollowUps')
                .doc(followUpId)
                .delete();
        } catch (error) {
            console.error('Error deleting followup: ', error);
        }
    };

    const updateFollowUpStatus = async (leadId: string, followUpId: string, status: string) => {
        try {
            const leadRef = firestore().collection('Leads').doc(leadId);

            await leadRef.collection('FollowUps').doc(followUpId).update({ status });

            const followUpsSnap = await leadRef.collection('FollowUps').get();
            const hasPending = followUpsSnap.docs.some(doc => doc.data().status !== 'Completed');
            await leadRef.update({
                status: hasPending ? 'Follow Up' : 'Active'
            });

        } catch (error) {
            console.error('Error updating status: ', error);
        }
    };

    const clearClosedHistory = async () => {
        try {
            const closedLeadsRefs = leads.filter((l: any) => l.status === 'Closed').map((l: any) => l.id);
            if (!closedLeadsRefs.length) return;

            const batch = firestore().batch();

            for (const docId of closedLeadsRefs) {
                const followUpsSnapshot = await firestore()
                    .collection('Leads')
                    .doc(docId)
                    .collection('FollowUps')
                    .get();
                followUpsSnapshot.forEach(doc => batch.delete(doc.ref));
                batch.delete(firestore().collection('Leads').doc(docId));
            }

            await batch.commit();

            setLeads(prevLeads => prevLeads.filter(l => l.status !== 'Closed'));
        } catch (error) {
            console.error('Error clearing history from Firebase:', error);
            throw error;
        }
    };

    return (
        <LeadsContext.Provider
            value={{
                leads, addLead, deleteLead, updateLead, closeLead, addFollowUp, updateFollowUpStatus, deleteFollowUp, clearClosedHistory, filterStatus, setFilterStatus
            }}
        >
            {children}
        </LeadsContext.Provider>
    );
};

export const useLeads = () => useContext(LeadsContext);