public interface MyInterface {
    void doSomething();
    
    String getValue();
    
    default void printInfo() {
        System.out.println("This is a default method in an interface");
    }
} 