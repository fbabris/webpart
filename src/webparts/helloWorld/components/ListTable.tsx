import { Button, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Tag } from "@fluentui/react-components";
import { IListTable, ITag } from "./interfaces/interfaces";
import * as React from 'react';
import Services from "./helpers/Services";
import { DeleteIcon, EditIcon } from "@fluentui/react-icons-mdl2";
import 'office-ui-fabric-core/dist/css/fabric.min.css';


const ListTable: React.FC<IListTable> = (props) =>{

    const gridClasses = {
        regular: 'ms-Grid-col ms-sm4 ms-md2 ms-lg2',
        large2: 'ms-Grid-col hiddenMdDown ms-lg2',
        large1: 'ms-Grid-col hiddenMdDown ms-lg1',
        small2: 'ms-Grid-col ms-sm2 ms-lg1', 
        small1: 'ms-Grid-col ms-sm1',
        mid3: 'ms-Grid-col hiddenSm ms-md3 ms-lg2',
    }

    const services = new Services;

    const columns = [
        { key: 'Title', fieldName: 'Title', className:gridClasses.regular},
        { key: 'DueDate', fieldName: 'Due Date', className:gridClasses.mid3},
        { key: 'RequestArea', fieldName: 'Request Area', className:gridClasses.large2},
        { key: 'AsignedManager', fieldName: 'Assigned Manager', className:gridClasses.regular},
        { key: 'Tags', fieldName: 'Tags', className:gridClasses.large2},
        { key: 'Status', fieldName: 'Status', className:gridClasses.small2},
        { key: 'EditDelete', fieldName: '', className:gridClasses.small1},
    ];

    return(
        <div className="ms-Grid">
        <h2>Request List:</h2>
        <Table sortable aria-label="Table with sort" >

        <TableHeader>
            <TableRow className="ms-Grid-row" style={{backgroundColor:"#F7F7F7"}}>
            {columns.map((column) => (
                <TableHeaderCell
                style={{ fontWeight:"bold" }} 
                key={column.key}
                className={column.className}
                onClick={() => props.handleSort(column.fieldName)}
                aria-sort={props.sortConfig.column === column.fieldName ? (props.sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
                {column.fieldName}
                {props.sortConfig.column === column.fieldName && (
                    <span className={`ms-Icon ${props.sortConfig.direction === 'asc' ? 'ms-Icon--SortUp' : 'ms-Icon--SortDown'}`} />
                )}
                </TableHeaderCell>
            ))}
            </TableRow>
        </TableHeader>

        <TableBody>
            {(props.filteredRequestItems).map((item) => (
            <TableRow className="ms-Grid-row" key={item.ID} onClick={() => props.handleUpdate(item)} style={{backgroundColor:services.colorCode(item.Status)}}>
                <TableCell className={gridClasses.regular} >{item.Title}</TableCell>
                <TableCell className={gridClasses.mid3} >{services.formattedDate(item.DueDate)}</TableCell>
                <TableCell className={gridClasses.large2}>{item.RequestArea}</TableCell>
                <TableCell className={gridClasses.regular}>{props.usersArray[item.AsignedManagerId]}</TableCell>
                <TableCell className={gridClasses.large2}>
                {item.Tags.map((tag:ITag, index:number) => (
                <Tag key={index} size="extra-small" shape="circular" appearance="brand">{tag.Label} </Tag>
                ))}
                </TableCell>
                <TableCell className={gridClasses.small2}>{item.Status}</TableCell>
                {
                item.Status === 'New' ? (
                    <div className={gridClasses.small1}>
                    <TableCell>
                        <Button icon={<EditIcon />} onClick={() => props.handleUpdate(item)} />
                    </TableCell>
                    <TableCell>
                        <Button icon={<DeleteIcon />} onClick={() => props.handleDelete(item)} />
                    </TableCell>
                    </div>
                ) : null
                }      
            </TableRow>
            ))}
        </TableBody>
        </Table>
        </div>
    );
}

export default ListTable;