import { Annotation } from "@/schema/annotation"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

export const AnnotationTable = (annotation: Annotation[]) => {
    const columns: GridColDef<Annotation>[] = [
        {
            field: "category_id",
            headerName: "Category ID",
            flex: 1,
            minWidth: 250,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => row.category_id.toString() || "",
        },
        {
            field: "bbox-x",
            headerName: "BBox-x",
            flex: 1,
            minWidth: 250,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => row.bbox.x.toFixed(2),
        },
        {
            field: "bbox-y",
            headerName: "BBox-y",
            flex: 1,
            minWidth: 250,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => row.bbox.y.toFixed(2),
        },
        {
            field: "bbox-width",
            headerName: "BBox-width",
            flex: 1,
            minWidth: 250,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => row.bbox.width.toFixed(2),
        },
        {
            field: "bbox-height",
            headerName: "BBox-height",
            flex: 1,
            minWidth: 250,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => row.bbox.height.toFixed(2),
        },
        {
            field: "area",
            headerName: "Area",
            flex: 1,
            minWidth: 250,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => row.area.toFixed(2),
        },
    ]

    return (
        <DataGrid
            rows={annotation}
            columns={columns}
            disableRowSelectionOnClick
            rowHeight={120}
            hideFooter={true}
        />
    )
}
