//it is going to taken object as an argument and allowed fields//video17
const filterObj = (obj, ...allowedFields) => {
const newObj = {};//create an empty object
Object.keys(obj).forEach((el) => {//we are creating a new object with the keys and basically arrays
    if(allowedFields.includes(el)) newObj[el] = obj[el];
});
return newObj;
}

module.exports = filterObj;