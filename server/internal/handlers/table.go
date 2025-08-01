package handlers

import (
	"net/http"

	dbdriver "github.com/cprakhar/datawhiz/internal/db_driver"
	poolmanager "github.com/cprakhar/datawhiz/internal/pool_manager"
	"github.com/cprakhar/datawhiz/utils/response"
	"github.com/gin-gonic/gin"
)

// HandleGetTables retrieves the list of tables from the database for the specified connection.
func (h *Handler) HandleGetTables(ctx *gin.Context) {
	connID := ctx.Param("id")
	if connID == "" {
		response.BadRequest(ctx, "Connection ID is required", nil)
		return
	}

	poolMgr, err := poolmanager.GetPool(connID)
	if err != nil {
		response.InternalError(ctx, err)
		return
	}

	dbName := ctx.Query("db_name")

	tables, err := dbdriver.ExtractDBTables(poolMgr.Pool, poolMgr.DBType, dbName)
	if err != nil {
		response.InternalError(ctx, err)
		return
	}

	response.JSON(ctx, http.StatusOK, "Tables retrieved successfully", tables)
}

// HandleGetTableSchema retrieves the schema of a specific table from the database for the specified connection.
func (h* Handler) HandleGetTableSchema(ctx *gin.Context) {
	connID := ctx.Param("id")
	if connID == "" {
		response.BadRequest(ctx, "Connection ID is required", nil)
		return
	}

	poolMgr, err := poolmanager.GetPool(connID)
	if err != nil {
		response.InternalError(ctx, err)
		return
	}

	tableName := ctx.Param("table_name")
	if tableName == "" {
		response.BadRequest(ctx, "Table name is required", nil)
		return
	}

    dbName := ctx.Query("db_name")

	schema, err := dbdriver.GetTableSchema(poolMgr.Pool, poolMgr.DBType, dbName, tableName)
	if err != nil {
		response.InternalError(ctx, err)
		return
	}

	response.JSON(ctx, http.StatusOK, "Table schema retrieved successfully", schema)
} 

// HandleGetTableRecords retrieves the records of a specific table from the database for the specified connection.
func (h *Handler) HandleGetTableRecords(ctx *gin.Context) {
	connID := ctx.Param("id")
	if connID == "" {
		response.BadRequest(ctx, "Connection ID is required", nil)
		return
	}

	poolMgr, err := poolmanager.GetPool(connID)
	if err != nil {
		response.InternalError(ctx, err)
		return
	}

	tableName := ctx.Param("table_name")
	if tableName == "" {
		response.BadRequest(ctx, "Table name is required", nil)
		return
	}

	dbName := ctx.Query("db_name")

	records, err := dbdriver.GetTableRecords(poolMgr.Pool, poolMgr.DBType, dbName, tableName)
	if err != nil {
		response.InternalError(ctx, err)
		return
	}

	response.JSON(ctx, http.StatusOK, "Table records retrieved successfully", records)
}