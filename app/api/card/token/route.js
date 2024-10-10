import axios from 'axios';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const card_number = searchParams.get("card_number");
  const card_cvv = searchParams.get("card_cvv");
  const card_exp_month = searchParams.get("card_exp_month");
  const card_exp_year = searchParams.get("card_exp_year");
  const card_name = searchParams.get("card_exp_year");
  
  const options = {
    method: "GET",
    url: `https://api.sandbox.midtrans.com/v2/token?client_key=SB-Mid-client-oQoSdjEOixsmyGLp&card_number=${card_number}&card_cvv=${card_cvv}&card_exp_month=${card_exp_month}&card_exp_year=${card_exp_year}&card_name=${card_name}`,
    headers: { accept: "application/json" },
  };

  try {
    const res = await axios.request(options);
    return Response.json({ status: true, data: res.data });
  } catch (error) {
    return Response.json({ status: false, message: error.message });
  }
}
