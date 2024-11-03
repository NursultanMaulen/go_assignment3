package main

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/NursultanMaulen/go_assignment3/models"
	"github.com/NursultanMaulen/go_assignment3/utils"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type Item struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

var items = []Item{
    {ID: 1, Name: "COCA COLA"},
	{ID: 2, Name: "FANTA"},
	{ID: 3, Name: "SPRITE"},
	{ID: 4, Name: "MIRINDA"},
	{ID: 5, Name: "GORILLA"},
}

var users = make(map[string]string)

func register(c *gin.Context) {
    var user models.User
    if err := c.BindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "REQUEST INVALID"})
        return
    }

    fmt.Printf("user.Role: %+v", user.Role)

    if user.Role == "" {
        user.Role = "user" 
    }

    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    users[user.Username] = string(hashedPassword)

    c.JSON(http.StatusOK, gin.H{"message": "REGISTRATION SUCCESSFUL", "role": user.Role})
}


func login(c *gin.Context) {
    var user models.User
    if err := c.BindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "REQUEST INVALID"})
        return
    }

    storedPassword, exists := users[user.Username]
    if !exists || bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(user.Password)) != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "INCORRECT USERNAME OR PASSWORD"})
        return
    }

    if (user.Role == ""){
        user.Role = "user";
    }

    token, err := utils.GenerateJWT(user.Username, user.Role)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "COULDNT CREATE TOKEN"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": token})
}

func authAndRoleMiddleware(requiredRole string) gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenStr := c.GetHeader("Authorization")
        if tokenStr == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "AUTHORIZATION HEADER MISSING"})
            c.Abort()
            return
        }

        claims, err := utils.VerifyJWT(tokenStr)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "TOKEN INVALID"})
            c.Abort()
            return
        }

        c.Set("username", claims.Username)

        if claims.Role != requiredRole {
            c.JSON(http.StatusForbidden, gin.H{"error": "ACCESS DENIED"})
            c.Abort()
            return
        }

        c.Next()
    }
}

func createItem(c *gin.Context) {
    var newItem Item
    if err := c.BindJSON(&newItem); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    newItem.ID = len(items) + 1
    items = append(items, newItem)
    c.JSON(http.StatusCreated, newItem)
}

func getItems(c *gin.Context) {
    c.JSON(http.StatusOK, items)
}
func getItemByID(c *gin.Context) {
    idParam := c.Param("id")
    id, err := strconv.Atoi(idParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID INVALIED"})
        return
    }
    for _, item := range items {
        if item.ID == id {
            c.JSON(http.StatusOK, item)
            return
        }
    }
    c.JSON(http.StatusNotFound, gin.H{"message": "ITEM NOT FOUND"})
}

func updateItem(c *gin.Context) {
    idParam := c.Param("id")
    id, err := strconv.Atoi(idParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID INVALID"})
        return
    }
    var updatedItem Item
    if err := c.BindJSON(&updatedItem); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    for i, item := range items {
        if item.ID == id {
            updatedItem.ID = id
            items[i] = updatedItem
            c.JSON(http.StatusOK, updatedItem)
            return
        }
    }
    c.JSON(http.StatusNotFound, gin.H{"message": "ITEM NOT FOUND"})
}

func deleteItem(c *gin.Context) {
    idParam := c.Param("id")
    id, err := strconv.Atoi(idParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID INVALIED"})
        return
    }
    for i, item := range items {
        if item.ID == id {
            items = append(items[:i], items[i+1:]...)
            c.JSON(http.StatusOK, gin.H{"message": "ITEM DELETED"})
            return
        }
    }
    c.JSON(http.StatusNotFound, gin.H{"message": "ITEM NOT FOUND"})
}



func main() {
    r := gin.Default()

	r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))

	r.POST("/register", register)
	r.POST("/login", login)

	protected := r.Group("/api")
    protected.Use(authAndRoleMiddleware("user"))
    {
		protected.POST("/items", createItem)
		protected.GET("/items", getItems)
		protected.GET("/items/:id", getItemByID)
		protected.PUT("/items/:id", updateItem)
		protected.DELETE("/items/:id", deleteItem)
    }

    protectedAdmin := r.Group("/admin")
    protectedAdmin.Use(authAndRoleMiddleware("admin"))
    {
        protectedAdmin.POST("/items", createItem)
        protectedAdmin.PUT("/items/:id", updateItem)
        protectedAdmin.DELETE("/items/:id", deleteItem)
    }

    r.Run()
}
