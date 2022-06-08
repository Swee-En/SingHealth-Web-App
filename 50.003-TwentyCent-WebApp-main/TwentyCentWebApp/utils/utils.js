export default class Utils {

    /**
     * Transform integer number of seconds since epoch into a time zone-dependent timestamp
     * @param {Number} val integer number of milliseconds since epoch
     */
    static secondsToTimestamp(val) {
        if (!Number.isInteger(val)) throw "Utils: intToTimestamp(): invalid input";
        var date = new Date(val*1000);
        var hours = date.getHours()+"";
        if (hours.length==1) hours = "0" + hours;
        var minutes = date.getMinutes()+"";
        if (minutes.length==1) minutes = "0" + minutes;
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${hours}:${minutes}`;
    }

    /**
     * Compare 2 DataClass objects of the same type by id
     * @param {DataClass} itemA 
     * @param {DataClass} itemB 
     */
    static compareDataClassObj(itemA,itemB) {
        if ((!itemA instanceof DataClass) || (!itemB instanceof DataClass)) throw "Utils: compareDataClassObj(): invalid input";
        if (itemA.constructor.name!==itemB.constructor.name) throw "Utils: compareDataClassObj(): both DataClass input objects must be of same type";
        if (itemA.id<itemB.id) return -1;
        if (itemA.id===itemB.id) return 0;
        return 1;
    }
}