package utils

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte("secretkey1337")

type Claims struct {
    Username string `json:"username"`
    Role     string `json:"role"` 
    jwt.StandardClaims
}


func GenerateJWT(username, role string) (string, error) {
    expirationTime := time.Now().Add(24 * time.Second)
    claims := &Claims{
        Username: username,
        Role:     role,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }
    fmt.Printf("Parsed claims: %+v\n", claims)

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtKey)
}


func VerifyJWT(tokenStr string) (*Claims, error) {
    claims := &Claims{}

    token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        return jwtKey, nil
    })

    if err != nil {
        return nil, fmt.Errorf("failed to parse token: %v", err)
    }

    if !token.Valid {
        return nil, fmt.Errorf("token is invalid")
    }

    if claims.ExpiresAt < time.Now().Unix() {
        return nil, fmt.Errorf("token has expired")
    }

    fmt.Printf("Parsed claims: %+v\n", claims)

    return claims, nil
}

