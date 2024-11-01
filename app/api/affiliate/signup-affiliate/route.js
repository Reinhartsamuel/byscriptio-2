
const dummyCustomerDatabase = [
    { id: '1', name: 'John', affiliatorCustomerId: '9' },
    { id: '2', name: 'Jennie', affiliatorCustomerId: '9' },
    { id: '3', name: 'Michael', affiliatorCustomerId: '2' },
    { id: '4', name: 'Samuel', affiliatorCustomerId: '2' },
    { id: '5', name: 'Frank', affiliatorCustomerId: '2' },
    { id: '11', name: 'Betty', affiliatorCustomerId: '2' },
    { id: '6', name: 'Susan', affiliatorCustomerId: '11' },
    { id: '7', name: 'Reinhart', affiliatorCustomerId: '10' },
    { id: '8', name: 'Mikaela', affiliatorCustomerId: '9' },
    { id: '9', name: 'Abdul' },
    { id: '10', name: 'Jamal', affiliatorCustomerId: '11' },
];
function getCustomerData (id) {
    dummyCustomerDatabase.find(
        (customer) => customer.id === id)
};


async function getAffiliateTree (customers, affiliatorId, level = 1) {
    const affiliateData = getCustomerData(affiliatorId);
    if (affiliateData.affiliatorCustomerId) {
        getAffiliateTree(affiliateData.affiliatorCustomerId, level + 1);
    } 
    customers.push({
        ...affiliateData,

    });
};


export default async function GET (request ) {
    try {
        const urlSearchParams = request.nextUrl.searchParams;
        const affiliatorCustomerId = urlSearchParams.get('affiliatorCustomerId');
        // get affiliator data


        const affData = getAffiliatorData(affiliatorCustomerId);
        if (affData.affiliatorCustomerId) {
            
        }




    } catch (error) {
        return new Response(
            JSON.stringify({ status: false, message: error.message }),
            { status: 500 }
        )
    }
}