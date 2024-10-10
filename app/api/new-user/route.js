



export async function POST (request) {
    try {
        const body = await request.json();





        return Response.json({ ...body});
    } catch (error) {
        return Response.json({ status : false, message : error.message});
    }
}




async function sendEmail (data) {
    const content = ``;
    const sender = '';
}