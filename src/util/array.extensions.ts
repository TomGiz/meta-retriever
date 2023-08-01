// declaration merging
declare global {
    interface Array<T> {
        unique(): Array<T>;

        distinct(): Array<T>;

        first(): T | undefined;

        last(): T | undefined;

        max(): T;

        min(): T;

        maxBy<V>(selector: (arg0: T) => V): V;

        minBy<V>(selector: (arg0: T) => V): V;
    }
}
export { };

Array.prototype.unique = function () {
    return [...new Set(this)];
};

Array.prototype.distinct = Array.prototype.unique;

Array.prototype.first = function () {
    return this.length === 0 ? undefined : this[0];
};

Array.prototype.last = function () {
    return this.length === 0 ? undefined : this[this.length - 1];
};

Array.prototype.max = function () {
    return this.reduce((m, x) => (m > x ? m : x));
};

Array.prototype.min = function () {
    return this.reduce((m, x) => (m < x ? m : x));
};

Array.prototype.maxBy = function (selector) {
    return this.map(selector).max();
};

Array.prototype.minBy = function (selector) {
    return this.map(selector).min();
};

