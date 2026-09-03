class Point {
    public x: any;
    public y: any;

    constructor(x: any, y: any) {
        this.x = x;
        this.y = y;
    }

    setCoordinates(input: any) {
        this.x = input.x;
        this.y = input.y;
    }

    move(dx: any, dy: any) {
        this.x += dx;
        this.y += dy;
    }
}