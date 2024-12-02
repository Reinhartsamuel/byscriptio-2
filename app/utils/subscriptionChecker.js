import { getCollectionFirebase } from './firebaseApi';

export default async function subscriptionChecker(customerId) {
    try {
        const findActiveSubscription = await getCollectionFirebase('subscriptions',[{field : 'customerId', operator : '==', value : customerId}]);
        
        if (findActiveSubscription?.length > 0) {
            return true;
        }
    } catch (error) {
        return false;
    }
}