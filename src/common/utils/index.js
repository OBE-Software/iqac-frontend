import { Buffer } from 'buffer';
export const getErrorBorderForReactSelect = (value) => {
    const style = {
        control: (base) => ({
            ...base,
            border: value ? '1px solid red' : '1px solid #ced4da'
        })
    };
    return style;
};
export const getPrviousDateFromToday = (days) => {
    let now = new Date();

    let lastdays = new Date(now.setDate(now.getDate() - days));

    return lastdays;
};
export const getPartOfTheStrUptoRequiredIndex = (str, firstIn, lastIn) => {
    const newStr = str?.slice(firstIn, lastIn) + '...';
    return newStr;
};

export const formatPhoneNumber = (value) => {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;

    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, '');

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;

    /*
     * we need to return the value with no formatting if its less then four digits
     * this is to avoid weird behavior that occurs if you  format the area code to early
     */
    if (phoneNumberLength < 4) return phoneNumber;

    /*
     * if phoneNumberLength is greater than 4 and less the 7 we start to return
     * the formatted number
     */
    if (phoneNumberLength < 7) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }

    /*
     * finally, if the phoneNumberLength is greater then seven, we add the last
     * bit of formatting and return it.
     */
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};
export const floatingNumber = (value) => {
    const floatRegExp = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
    let isValid = false;
    if (value === '' || (floatRegExp.test(value) && value <= 100 && value >= 0)) {
        if (value.includes('.')) {
            const splitData = value.split('.');
            if (splitData[1].length > 2) {
                isValid = false;
            } else {
                isValid = true;
            }
        } else {
            isValid = true;
        }
    }
    return isValid;
};

export const includeDashedInPhoneNumber = (number) => {
    if (number) {
        let changedNumber = number.split('');
        changedNumber.splice(3, 0, '-');
        changedNumber.splice(7, 0, '-');
        return changedNumber.join('');
    }
};

export const convertBase64Url = (str) => {
    const encodedString = Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return encodedString;
};

export const addZeroesToZipcode = (zip) => {
    let value = zip + '';
    while (value.length < 5) {
        value = '0' + value;
    }

    return value;
};
