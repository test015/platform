package inmem_test

import (
	"context"
	"testing"

	"github.com/influxdata/platform"
	"github.com/influxdata/platform/inmem"
	"github.com/influxdata/platform/kv"
	platformtesting "github.com/influxdata/platform/testing"
)

func initUserKVService(f platformtesting.UserFields, t *testing.T) (platform.UserService, func()) {
	s := inmem.NewKVStore()
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
	return svc, func() {
		for _, u := range f.Users {
			if err := svc.DeleteUser(ctx, u.ID); err != nil {
				t.Logf("failed to remove users: %v", err)
			}
		}
	}
}

func TestUserService(t *testing.T) {
	platformtesting.UserService(initUserKVService, t)
}

func initKVStore(f platformtesting.KVStoreFields, t *testing.T) (kv.Store, func()) {
	s := inmem.NewKVStore()

	err := s.Update(func(tx kv.Tx) error {
		if err := tx.CreateBucketIfNotExists(f.Bucket); err != nil {
			return err
		}

		b, err := tx.Bucket(f.Bucket)
		if err != nil {
			return err
		}

		for _, p := range f.Pairs {
			if err := b.Put(p.Key, p.Value); err != nil {
				return err
			}
		}

		return nil
	})
	if err != nil {
		t.Fatalf("failed to put keys: %v", err)
	}
	return s, func() {}
}

func TestKVStore(t *testing.T) {
	platformtesting.KVStore(initKVStore, t)
}
