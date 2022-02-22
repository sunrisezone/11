class Logger {
    space = 0;
    prefix = "";

    constructor(space = 0) {
        this.space = space;
        this.prefix = " ".repeat(space);
    }

    next() {
        return new Logger(this.space + 2);
    }

    log(...msg: any[]) {
        console.log(this.prefix, "\u001b[94m" + "[LOG]" + "\u001b[m", ...msg);
    }

    error(...msg: any[]) {
        console.log(this.prefix, "\u001b[91m" + "[ERROR]" + "\u001b[m", ...msg);
    }

    warn(...msg: any[]) {
        console.log(this.prefix, "\u001b[93m" + "[WARN]" + "\u001b[m", ...msg);
    }

    info(...msg: any[]) {
        console.log(this.prefix, "\u001b[96m" + "[INFO]" + "\u001b[m", ...msg);
    }

    debug(...msg: any[]) {
        console.log(this.prefix, "\u001b[95m" + "[DEBUG]" + "\u001b[m", ...msg);
    }
}

export default Logger;
