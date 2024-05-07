export class Reader {
    private content: string;
    
    private cursorStart: number;
    private cursor: number;
    private cursorLine: number;
    
    constructor(value?: string) {
        this.content = value ?? "";
        this.cursorStart = 0;
        this.cursor = 0;
        this.cursorLine = 1;
    }

    public isEmpty(): boolean {
        return this.cursor >= this.content.length;
    }

    public start(): void {
        this.cursorStart = this.cursor;
    }

    public end(): string {
        return this.content.substring(this.cursorStart, this.cursor);
    }

    public checkNewLine(): void {
        if(this.content.charAt(this.cursor) == "\n")
            this.cursorLine++;
    }

    public advance(): string {
        this.checkNewLine();
        return this.content.charAt(this.cursor++);
    }

    public match(ch: string): boolean {
        if(this.isEmpty())
            return false;
        if(this.content.charAt(this.cursor) != ch)
            return false;
        this.checkNewLine();
        this.cursor++;
        return true;
    }

    public peek(): string {
        if(this.isEmpty())
            return '\0';
        return this.content.charAt(this.cursor);
    }
    
    public skipTo(ch: string): void {
        while(!this.isEmpty() && this.peek() != ch) {
            this.checkNewLine();
            this.cursor++;
        }
    }

    public getCursor(): number {
        return this.cursor;
    }

    public getLine(): number {
        return this.cursorLine;
    }

    public length(): number {
        return this.content.length - this.cursor;
    }

    public toString(): string {
        return this.content;
    }
    
    public valueOf(): string {
        return this.content;
    }
}