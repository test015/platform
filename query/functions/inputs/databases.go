package inputs

import (
	"context"
	"fmt"
	"github.com/influxdata/flux/memory"
	"github.com/influxdata/flux/values"

	"github.com/influxdata/flux"
	"github.com/influxdata/flux/execute"
	"github.com/influxdata/flux/functions/inputs"
	"github.com/influxdata/flux/plan"
	"github.com/influxdata/platform"
	"github.com/influxdata/platform/query"
	"github.com/pkg/errors"
)

func init() {
	execute.RegisterSource(inputs.DatabasesKind, createDatabasesSource)
}

type DatabasesDecoder struct {
	orgID     platform.ID
	deps      DatabasesDependencies
	databases []*platform.DBRPMapping
	alloc     *memory.Allocator
	ctx       context.Context
}

func (bd *DatabasesDecoder) Connect() error {
	return nil
}

func (bd *DatabasesDecoder) Fetch() (bool, error) {

	b, _, err := bd.deps.dbrp.FindMany(bd.ctx, platform.DBRPMappingFilter{})
	if err != nil {
		return false, err
	}
	bd.databases = b
	return false, nil
}

func (bd *DatabasesDecoder) Decode() (flux.Table, error) {
	kb := execute.NewGroupKeyBuilder(nil)
	kb.AddKeyValue("organizationID", values.NewString(bd.databases[0].OrganizationID.String()))
	gk, err := kb.Build()
	if err != nil {
		return nil, err
	}

	b := execute.NewColListTableBuilder(gk, bd.alloc)

	if _, err := b.AddCol(flux.ColMeta{
		Label: "organizationID",
		Type:  flux.TString,
	}); err != nil {
		return nil, err
	}
	if _, err := b.AddCol(flux.ColMeta{
		Label: "databaseName",
		Type:  flux.TString,
	}); err != nil {
		return nil, err
	}
	if _, err := b.AddCol(flux.ColMeta{
		Label: "retentionPolicy",
		Type:  flux.TString,
	}); err != nil {
		return nil, err
	}
	if _, err := b.AddCol(flux.ColMeta{
		Label: "retentionPeriod",
		Type:  flux.TInt,
	}); err != nil {
		return nil, err
	}
	if _, err := b.AddCol(flux.ColMeta{
		Label: "bucketId",
		Type:  flux.TString,
	}); err != nil {
		return nil, err
	}

	for _, db := range bd.databases {
		if bucket, err := bd.deps.bucketLookup.FindBucketByID(bd.ctx, db.BucketID); err != nil {
			return nil, err
		} else {
			_ = b.AppendString(0, db.OrganizationID.String())
			_ = b.AppendString(1, db.Database)
			_ = b.AppendString(2, db.RetentionPolicy)
			_ = b.AppendInt(3, bucket.RetentionPeriod.Nanoseconds())
			_ = b.AppendString(4, db.BucketID.String())
		}
	}

	return b.Table()
}

func createDatabasesSource(prSpec plan.ProcedureSpec, dsid execute.DatasetID, a execute.Administration) (execute.Source, error) {
	_, ok := prSpec.(*inputs.DatabasesProcedureSpec)
	if !ok {
		return nil, fmt.Errorf("invalid spec type %T", prSpec)
	}

	// the dependencies used for FromKind are adequate for what we need here
	// so there's no need to inject custom dependencies for databases()
	deps := a.Dependencies()[inputs.DatabasesKind].(DatabasesDependencies)
	req := query.RequestFromContext(a.Context())
	if req == nil {
		return nil, errors.New("missing request on context")
	}
	orgID := req.OrganizationID

	bd := &DatabasesDecoder{orgID: orgID, deps: deps, alloc: a.Allocator(), ctx: a.Context()}

	return inputs.CreateSourceFromDecoder(bd, dsid, a)

}

type DatabasesDependencies struct {
	dbrp         platform.DBRPMappingService
	bucketLookup platform.BucketService
}

func InjectDatabasesDependencies(depsMap execute.Dependencies, deps DatabasesDependencies) error {
	if deps.dbrp == nil {
		return errors.New("missing all databases lookup dependency")
	}

	if deps.bucketLookup == nil {
		return errors.New("missing buckets lookup dependency")
	}

	depsMap[inputs.DatabasesKind] = deps
	return nil
}
