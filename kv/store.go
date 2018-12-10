package kv

import (
	"errors"
)

var (
	// ErrKeyNotFound is the error returned when the key requested is not found.
	ErrKeyNotFound = errors.New("key not found")
)

// Store is an interface for a generic key value store. It is modeled after
// the boltdb database struct.
type Store interface {
	// View opens up a transaction that will not write to any data. Implementing interfaces
	// should take care to ensure that all view transactions do not mutate any data.
	View(func(Tx) error) error
	// Update opens up a transaction that will mutate data.
	Update(func(Tx) error) error
}

// Tx is a transaction in the store.
type Tx interface {
	Bucket(b []byte) (Bucket, error)
}

// Bucket is the abstraction used to perform get/put/delete/get-many operations
// in a key value store.
type Bucket interface {
	Get(key []byte) ([]byte, error)
	Cursor() (Cursor, error)
	// Put should error if the transaction it was called in is not writable.
	Put(key, value []byte) error
	// Delete should error if the transaction it was called in is not writable.
	Delete(key []byte) error
}

// Cursor is an abstraction for iterating/ranging through data. A concrete implementation
// of a cursor can be found in cursor.go.
type Cursor interface {
	Seek(prefix []byte) (k []byte, v []byte, err error)
	First() (k []byte, v []byte, err error)
	Last() (k []byte, v []byte, err error)
	Next() (k []byte, v []byte, err error)
	Prev() (k []byte, v []byte, err error)
}
