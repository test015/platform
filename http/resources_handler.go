package http

import (
	"net/http"

	"github.com/influxdata/platform"
	"github.com/julienschmidt/httprouter"
)

const (
	resourcesPath = "/api/v2/resources"
)

type ResourcesHandler struct {
	*httprouter.Router
	UserResourceMappingService platform.UserResourceMappingService
	BucketService              platform.BucketService
	DashboardService           platform.DashboardService
	TaskService                platform.TaskService
	ViewService                platform.ViewService
}

func NewResourcesHandler() *ResourcesHandler {
	h := &ResourcesHandler{
		Router: httprouter.New(),
	}

	h.HandlerFunc("GET", resourcesPath, h.handleGetResources)
	return h
}

type resourcesResponse struct {
	Links      map[string]string    `json:"links"`
	Buckets    []*bucketResponse    `json:"buckets"`
	Dashboards []*dashboardResponse `json:"dashboards"`
	Tasks      []*taskResponse      `json:"tasks"`
	Views      []*viewResponse      `json:"views"`
}

func (h *ResourcesHandler) handleGetResources(w http.ResponseWriter, r *http.Request) {

}
