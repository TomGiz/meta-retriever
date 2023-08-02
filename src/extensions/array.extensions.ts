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

        take(count: number): Array<T>;

        any(selector: (arg0: T) => boolean): boolean;
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

Array.prototype.take = function (count) {
    return this.slice(0, count-1);
};

Array.prototype.any = function (selector) {
    for (const el of this) {
        if (selector(el)) return true;
    }
    return false;
};