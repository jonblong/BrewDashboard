package main

import (
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"net/http"
	"time"
)

type SolarPerformance struct {
	CurrentPower   float64
	EnergyToday    float64
	EnergyMonth    float64
	EnergyLifetime float64
}

var lastTime time.Time
var lastKWP float64
var energySinceStart float64
var r1 *rand.Rand

func main() {
	fmt.Println("Starting Terrapin Brewery data simulator...")
	lastTime = time.Now()
	http.HandleFunc("/terrapin", foo)
	lastKWP = 220000.0
	energySinceStart = 0

	s1 := rand.NewSource(time.Now().UnixNano())
	r1 = rand.New(s1)

	fmt.Println("Serving now on localhost:6969/terrapin")
	fmt.Println()

	http.ListenAndServe(":6969", nil)
}

func foo(w http.ResponseWriter, r *http.Request) {
	mwh := 1000000.0

	timeSinceLast := time.Since(lastTime)
	energySinceLast := timeSinceLast.Hours() * lastKWP * math.Max(r1.Float64()+.1, .5)
	energySinceStart += energySinceLast

	lastKWP = ((r1.Float64() / 3) + .6) * 230000
	perf := SolarPerformance{
		CurrentPower:   lastKWP,
		EnergyToday:    mwh + energySinceStart,
		EnergyMonth:    15*mwh + energySinceStart,
		EnergyLifetime: 100*mwh + energySinceStart,
	}

	lastTime = time.Now()

	js, err := json.Marshal(perf)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}
