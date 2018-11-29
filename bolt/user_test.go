package bolt_test

import (
	"context"
	"testing"

	"github.com/influxdata/platform"
	bolt "github.com/influxdata/platform/bolt"
	"github.com/influxdata/platform/kv"
	platformtesting "github.com/influxdata/platform/testing"
)

func initUserService(f platformtesting.UserFields, t *testing.T) (platform.UserService, string, func()) {
	c, closeFn, err := NewTestClient()
	if err != nil {
		t.Fatalf("failed to create new kv store: %v", err)
	}
	svc := kv.NewUserService(s, f.IDGenerator)
	if err := svc.Initialize(); err != nil {
		t.Fatalf("error initializing user service: %v", err)
	}

	ctx := context.Background()
	for _, u := range f.Users {
		if err := svc.PutUser(ctx, u); err != nil {
			t.Fatalf("failed to populate users")
		}
	}
	return c, bolt.OpPrefix, func() {
		defer closeFn()
		for _, u := range f.Users {
			if err := svc.DeleteUser(ctx, u.ID); err != nil {
				t.Logf("failed to remove users: %v", err)
			}
		}
	}
}

func TestUserService(t *testing.T) {
	platformtesting.UserService(initUserService, t)
}
