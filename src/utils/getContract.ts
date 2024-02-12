const getContract = (type: string) => {
    const network = process.env.REACT_APP_NETWORK;
    if(type === 'fdic') {
        const fdic = require(`../contracts/${network}/REFLECT.json`)
        return fdic
    }
}

export { getContract }