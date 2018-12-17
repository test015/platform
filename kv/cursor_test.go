package kv_test

import (
	"bytes"
	"fmt"
	"testing"

	"github.com/influxdata/platform/kv"
)

func TestStaticCursor_First(t *testing.T) {
	type args struct {
		pairs []kv.Pair
	}
	type wants struct {
		key []byte
		val []byte
		err error
	}

	tests := []struct {
		name  string
		args  args
		wants wants
	}{
		{
			name: "nil pairs",
			args: args{
				pairs: nil,
			},
			wants: wants{
				err: fmt.Errorf("index exceeds the length of the pairs"),
			},
		},
		{
			name: "empty pairs",
			args: args{
				pairs: []kv.Pair{},
			},
			wants: wants{
				err: fmt.Errorf("index exceeds the length of the pairs"),
			},
		},
		{
			name: "unsorted pairs",
			args: args{
				pairs: []kv.Pair{
					{
						Key:   []byte("bcd"),
						Value: []byte("yoyo"),
					},
					{
						Key:   []byte("abc"),
						Value: []byte("oyoy"),
					},
				},
			},
			wants: wants{
				key: []byte("abc"),
				val: []byte("oyoy"),
			},
		},
		{
			name: "sorted pairs",
			args: args{
				pairs: []kv.Pair{
					{
						Key:   []byte("abc"),
						Value: []byte("oyoy"),
					},
					{
						Key:   []byte("bcd"),
						Value: []byte("yoyo"),
					},
				},
			},
			wants: wants{
				key: []byte("abc"),
				val: []byte("oyoy"),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cur := kv.NewStaticCursor(tt.args.pairs)

			key, val, err := cur.First()

			if (err != nil) != (tt.wants.err != nil) {
				t.Fatalf("expected error '%v' got '%v'", tt.wants.err, err)
			}

			if err != nil && tt.wants.err != nil {
				if err.Error() != tt.wants.err.Error() {
					t.Fatalf("expected error messages to match '%v' got '%v'", tt.wants.err, err.Error())
				}
				return
			}

			if want, got := tt.wants.key, key; !bytes.Equal(want, got) {
				t.Errorf("exptected to get key %s got %s", string(want), string(got))
			}

			if want, got := tt.wants.val, val; !bytes.Equal(want, got) {
				t.Errorf("exptected to get value %s got %s", string(want), string(got))
			}
		})
	}
}

func TestStaticCursor_Last(t *testing.T) {
	type args struct {
		pairs []kv.Pair
	}
	type wants struct {
		key []byte
		val []byte
		err error
	}

	tests := []struct {
		name  string
		args  args
		wants wants
	}{
		{
			name: "nil pairs",
			args: args{
				pairs: nil,
			},
			wants: wants{
				err: fmt.Errorf("index value is negative"),
			},
		},
		{
			name: "empty pairs",
			args: args{
				pairs: []kv.Pair{},
			},
			wants: wants{
				err: fmt.Errorf("index value is negative"),
			},
		},
		{
			name: "unsorted pairs",
			args: args{
				pairs: []kv.Pair{
					{
						Key:   []byte("bcd"),
						Value: []byte("yoyo"),
					},
					{
						Key:   []byte("abc"),
						Value: []byte("oyoy"),
					},
				},
			},
			wants: wants{
				key: []byte("bcd"),
				val: []byte("yoyo"),
			},
		},
		{
			name: "sorted pairs",
			args: args{
				pairs: []kv.Pair{
					{
						Key:   []byte("abc"),
						Value: []byte("oyoy"),
					},
					{
						Key:   []byte("bcd"),
						Value: []byte("yoyo"),
					},
				},
			},
			wants: wants{
				key: []byte("bcd"),
				val: []byte("yoyo"),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cur := kv.NewStaticCursor(tt.args.pairs)

			key, val, err := cur.Last()

			if (err != nil) != (tt.wants.err != nil) {
				t.Fatalf("expected error '%v' got '%v'", tt.wants.err, err)
			}

			if err != nil && tt.wants.err != nil {
				if err.Error() != tt.wants.err.Error() {
					t.Fatalf("expected error messages to match '%v' got '%v'", tt.wants.err, err.Error())
				}
			}

			if want, got := tt.wants.key, key; !bytes.Equal(want, got) {
				t.Errorf("exptected to get key %s got %s", string(want), string(got))
			}

			if want, got := tt.wants.val, val; !bytes.Equal(want, got) {
				t.Errorf("exptected to get value %s got %s", string(want), string(got))
			}
		})
	}
}

func TestStaticCursor_Seek(t *testing.T) {
	type args struct {
		prefix []byte
		pairs  []kv.Pair
	}
	type wants struct {
		key []byte
		val []byte
		err error
	}

	tests := []struct {
		name  string
		args  args
		wants wants
	}{
		{
			name: "sorted pairs",
			args: args{
				prefix: []byte("bc"),
				pairs: []kv.Pair{
					{
						Key:   []byte("abc"),
						Value: []byte("oyoy"),
					},
					{
						Key:   []byte("abcd"),
						Value: []byte("oyoy"),
					},
					{
						Key:   []byte("bcd"),
						Value: []byte("yoyo"),
					},
					{
						Key:   []byte("bcde"),
						Value: []byte("yoyo"),
					},
					{
						Key:   []byte("cde"),
						Value: []byte("yyoo"),
					},
				},
			},
			wants: wants{
				key: []byte("bcd"),
				val: []byte("yoyo"),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cur := kv.NewStaticCursor(tt.args.pairs)

			key, val, err := cur.Seek(tt.args.prefix)

			if (err != nil) != (tt.wants.err != nil) {
				t.Fatalf("expected error '%v' got '%v'", tt.wants.err, err)
			}

			if err != nil && tt.wants.err != nil {
				if err.Error() != tt.wants.err.Error() {
					t.Fatalf("expected error messages to match '%v' got '%v'", tt.wants.err, err.Error())
				}
			}

			if want, got := tt.wants.key, key; !bytes.Equal(want, got) {
				t.Errorf("exptected to get key %s got %s", string(want), string(got))
			}

			if want, got := tt.wants.val, val; !bytes.Equal(want, got) {
				t.Errorf("exptected to get value %s got %s", string(want), string(got))
			}
		})
	}
}
