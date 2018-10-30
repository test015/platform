package http

import (
	"net/http"

	plat "github.com/influxdata/platform"
	platcontext "github.com/influxdata/platform/context"
	"github.com/julienschmidt/httprouter"
)

const (
	resourcesPath = "/api/v2/resources"
)

type ResourcesHandler struct {
	*httprouter.Router
	UserResourceMappingService plat.UserResourceMappingService
	BucketService              plat.BucketService
	DashboardService           plat.DashboardService
	TaskService                plat.TaskService
	ViewService                plat.ViewService
}

func NewResourcesHandler() *ResourcesHandler {
	h := &ResourcesHandler{
		Router: httprouter.New(),
	}

	h.HandlerFunc("GET", resourcesPath, h.handleGetResources)
	return h
}

type resourcesResponse struct {
	Links      map[string]string   `json:"links"`
	Buckets    *bucketsResponse    `json:"buckets"`
	Dashboards *dashboardsResponse `json:"dashboards"`
	Tasks      *tasksResponse      `json:"tasks"`
	Views      *viewsResponse      `json:"views"`
}

func (h *ResourcesHandler) handleGetResources(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	a, err := platcontext.GetAuthorizer(ctx)
	if err != nil {
		EncodeError(ctx, err, w)
		return
	}

	var userID plat.ID
	switch s := a.(type) {
	case *plat.Session:
		userID = s.UserID
	case *plat.Authorization:
		userID = s.UserID
	}

	mappings, _, err := h.UserResourceMappingService.FindUserResourceMappings(ctx, plat.UserResourceMappingFilter{
		UserID: userID,
	})
	if err != nil {
		EncodeError(ctx, err, w)
	}

	var bf plat.BucketFilter
	var df plat.DashboardFilter
	var tf plat.TaskFilter
	var vf plat.ViewFilter

	for _, m := range mappings {
		switch m.ResourceType {
		case plat.BucketResourceType:
			bf.IDs = append(bf.IDs, &m.ResourceID)
		case plat.DashboardResourceType:
			df.IDs = append(df.IDs, &m.ResourceID)
		case plat.TaskResourceType:
			tf.IDs = append(tf.IDs, &m.ResourceID)
		case plat.ViewResourceType:
			vf.IDs = append(vf.IDs, &m.ResourceID)
		}
	}

	response := &resourcesResponse{}

	if len(bf.IDs) > 0 {
		buckets, _, err := h.BucketService.FindBuckets(ctx, bf)
		if err != nil {
			EncodeError(ctx, err, w)
		}
		response.Buckets = newBucketsResponse(plat.FindOptions{}, bf, buckets)
	}
	if len(df.IDs) > 0 {
		dashboards, _, err := h.DashboardService.FindDashboards(ctx, df, plat.FindOptions{})
		if err != nil {
			EncodeError(ctx, err, w)
		}
		response.Dashboards = dashboards
	}
	if len(tf.IDs) > 0 {
		tasks, _, err := h.TaskService.FindTasks(ctx, tf)
		if err != nil {
			EncodeError(ctx, err, w)
			response.Tasks = tasks
		}
	}
	if len(vf.IDs) > 0 {
		views, _, err := h.ViewService.FindViews(ctx, vf)
		if err != nil {
			EncodeError(ctx, err, w)
			response.Views = views
		}
	}

	if err := encodeResponse(ctx, w, http.StatusOK, response); err != nil {
		EncodeError(ctx, err, w)
		return
	}
}
