export default function extractObjectArray(rawdata) {
    const tableHeader = rawdata[0];
    const withoutHeader = rawdata.slice(1);
    const newArr = withoutHeader.map((item) => {
      let obj = {};
      for (let i = 0; i < tableHeader.length; i++) {
        obj[tableHeader[i]] = item[i] || null;
      }
      return obj;
    });
    return newArr;
  }