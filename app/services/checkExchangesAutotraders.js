import {
  getCollectionFirebase,
  updateDocumentFirebase,
} from '../utils/firebaseApi';

export default async function checkExchangesAutotraders(email, uid) {
  try {
    const [exchanges, autotraders] = await Promise.all([
      await getCollectionFirebase('exchange_accounts', [
        { field: 'email', operator: '==', value: email },
        { field: 'uid', operator: '==', value: '' },
      ]),
      await getCollectionFirebase('dca_bots', [
        { field: 'email', operator: '==', value: email },
        { field: 'uid', operator: '==', value: '' },
      ]),
    ]);
    // console.log(exchanges, 'ini dca bots lohhhh');
    if (exchanges?.length > 0) {
    //   console.log('updating uid for exchange accounts:::', exchanges, uid);
      await Promise.all(
        exchanges.map(async (exchange) => {
          await updateDocumentFirebase('exchange_accounts', exchange.id, {
            uid,
          });
        })
      );
    }

    if (autotraders?.length > 0) {
    //   console.log('updating uid for autotraders:::', autotraders, uid);

      await Promise.all(
        autotraders.map(async (autotrader) => {
          await updateDocumentFirebase('exchange_accounts', autotrader.id, {
            uid,
          });
        })
      );
    }
  } catch (error) {
    console.error(error.message, '::error checkExchangesAutotraders');
  }
}
