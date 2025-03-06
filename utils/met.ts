import { message } from 'antd';
import BigNumber from 'bignumber.js';
import moment from 'moment';

export enum MomentUnit {
    years = 'years',
    months = 'months',
    days = 'days',
    minutes = 'minutes',
    seconds = 'seconds'
}

export const $sleep = (ms: number = 1000): Promise<Function> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const $copy = (text: any): Promise<void> => {
    try {
        var textArea: any = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            // console.log(successful);
            // message.success('Copy Successfully');
        } catch (err) {
            // console.log('Oops, unable to copy');
            // message.success('Copy Fail');
        }
        document.body.removeChild(textArea);
        return Promise.resolve();
    } catch (e) {
        return Promise.reject();
    }
};

export const $BigNumber = (val: string | number = 1) => {
    return new BigNumber(val);
};

export const $shiftedBy = (data: number | string, decimals: any): string => {
    if (!data) return '0';
    decimals = Number(decimals);
    return $BigNumber(data).shiftedBy(decimals).toFixed();
};

export const $shiftedByFixed = (data: string | number, decimals: number, acc: number = 4) => {
    if (!data) return 0;
    decimals = Number(decimals);
    return Number($BigNumber(data).shiftedBy(decimals).toFixed(acc, 1));
};

export const $toFixed = (data: any, acc: number) => {
    if ((!data && Number(data) !== 0) || String(data).indexOf('--') !== -1) return '--';
    return $BigNumber(data).toFixed(acc, 1);
};

export const $clearNoNum = (val: any): any => {
    val = val.replace(/[^\d.]/g, '');

    val = val.replace(/\.{2,}/g, '.');

    val = val.replace(/^\./g, '');

    val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');

    return val;
};

// input val filter   e: React.FormEvent<HTMLInputElement>
export const $filterNumber = (e: any, setval?: Function) => {
    function clearNoNum(val: any) {
        val = val.replace(/[^\d.]/g, '');

        val = val.replace(/\.{2,}/g, '.');

        val = val.replace(/^\./g, '');

        val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');

        return val;
    }
    if (setval) {
        setval(clearNoNum(e.target.value));
    } else {
        return clearNoNum(e.target.value);
    }
};
export const $onlyNumber = (val: any) => {
    return val.replace(/[^\d]/g, '');
};

export const $numFormat = (val: number | string, acc: number = 4, flag: boolean = true) => {
    if (!val || val.toString().indexOf('-') != -1) {
        return val;
    } else if (!flag) {
        return $BigNumber(val).toFixed(acc, 1);
    }

    let reg = /(\d)(?=(?:\d{3})+$)/g;
    val = $BigNumber(val).toFixed(acc, 1);
    const strAry = val.toString().split('.');
    return `${strAry[0].replace(reg, '$1,')}${strAry.length > 1 ? '.' + strAry[1] : ''}`;
};

export const $moreLessThan = (value: string | number, acc = 4, decimal: number = 4) => {
    const val = $BigNumber(value);
    let i = 0,
        _value = '0.';
    for (i; i < decimal - 1; i++) {
        _value = `${_value}0`;
    }
    _value = _value = `${_value}1`;

    if (Number(value) > 0) {
        return !val.isZero() && val.isLessThan(Number(_value)) ? `<${_value}` : val.isNaN() ? value : $shiftedByFixed(value, 0, acc);
    } else if (Number(value) == 0) {
        return 0;
    } else {
        return !val.isZero() && val.gt(-Number(_value)) ? `<-${_value}` : val.isNaN() ? value : $shiftedByFixed(value, 0, acc);
    }
};

export const $hash = (txHash: any, length: number = 4, lastLength?: number) => {
    if (!txHash) {
        return '--';
    }
    if (!lastLength && lastLength !== 0) lastLength = length;
    if (txHash.length > length) {
        return txHash.substring(0, length) + '...' + txHash.substring(txHash.length - lastLength, txHash.length);
    } else {
        return txHash;
    }
};

export const $enumKey = (list: { [key: string]: string | number }[], value: string | number, target: string = 'name', key: string = 'key'): string | number => {
    if (!value && ![0, '0'].includes(value)) return '';
    const _tar: any = list.find((item) => item[key] === value);
    return _tar[target] || '';
};

export const $trim = (event: any): string => {
    return event.target.value.trim();
};

export const $trimNumber = (event: any): string | number => {
    return event.target.value.replace(/[^\d^\.]+/g, '').trim();
};

export async function $delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

export const $getQuery = () => {
    if (typeof window !== 'undefined') {
        const href = window.location.href;
        const query = href.substring(href.indexOf('?') + 1);
        const types = query.split('&');
        let obj: any = {},
            i = 0;
        for (i; i < types.length; i++) {
            const pari = types[i].split('=');
            obj[pari[0]] = pari[1];
        }
        return obj;
    } else {
        return {};
    }
};

export const $toExponential = (val: string | number, acc: number = 2) => {
    let _val: string | number = '';
    const vals = $toFixed($BigNumber(val), acc);
    if ($BigNumber(vals).gt(100000000000000000000)) {
        _val = vals;
    } else {
        _val = Number(vals);
    }
    return _val;
};

export const $momentTimes = (date: any, type: string = 'start'): Record<string, number> => {
    let startT = moment(date);
    let curT = moment(new Date());
    let diff = type === 'start' ? startT.diff(curT) : curT.diff(startT);
    const timeDiff = moment.duration(diff);
    return {
        // months: Math.max(timeDiff.months(), 0),
        days: Math.max(timeDiff.days(), 0),
        hours: Math.max(timeDiff.hours(), 0),
        minutes: Math.max(timeDiff.minutes(), 0),
        seconds: Math.max(timeDiff.seconds(), 0)
    };
};
export const $diffDate = (date: any, unit: MomentUnit = MomentUnit.days): number => {
    let startT = moment(date);
    let endT = moment(new Date());
    return endT.diff(startT, unit);
};

export const $formatNumber = (val: string | number) => {
    val = Number(val || 0);
    if (val < 1000) {
        return val;
    } else {
        return Number($toFixed(val / 1000, 1)) + 'k';
    }
};

export const $isChinese = (str: string): boolean => {
    const chineseReg: RegExp = /[\u4e00-\u9fa5]/;
    return chineseReg.test(str);
};

export const $openLink = (link: string) => {
    const a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.click();
    a.remove();
};
