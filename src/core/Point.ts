class Point {
       public x: number;
       public y: number;
    constructor(x: number, y: number) {
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