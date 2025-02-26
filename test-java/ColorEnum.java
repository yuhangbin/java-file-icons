public enum ColorEnum {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF"),
    YELLOW("#FFFF00"),
    BLACK("#000000"),
    WHITE("#FFFFFF");
    
    private final String hexCode;
    
    ColorEnum(String hexCode) {
        this.hexCode = hexCode;
    }
    
    public String getHexCode() {
        return hexCode;
    }
} 