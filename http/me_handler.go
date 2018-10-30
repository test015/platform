package http

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

const (
	mePath = "/api/v2/me"
)

type MeHandler struct {
	*httprouter.Router
}

func NewMeHandler() *MeHandler {
	h := &MeHandler{
		Router: httprouter.New(),
	}

	h.HandlerFunc("GET", mePath, h.handleGetResources)
	return h
}

type meResponse struct {
	Links      map[string]string    `json:"links"`
	Buckets    []*bucketResponse    `json:"buckets"`
	Dashboards []*dashboardResponse `json:"dashboards"`
	Tasks      []*taskResponse      `json:"tasks"`
	Views      []*viewResponse      `json:"views"`
}

func (h *MeHandler) handleGetResources(w http.ResponseWriter, r *http.Request) {

}
