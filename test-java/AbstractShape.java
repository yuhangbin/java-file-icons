public abstract class AbstractShape {
    protected String color;
    
    public AbstractShape(String color) {
        this.color = color;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public abstract double calculateArea();
    
    public abstract double calculatePerimeter();
} 