import { Button, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "@fluentui/react-components";
import { IListTable, Tag } from "./interfaces/interfaces";
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
        // { key: 'Description', fieldName: 'Description', className:gridClasses.large1},
        { key: 'DueDate', fieldName: 'DueDate', className:gridClasses.mid3},
        // { key: 'ExecutionDate', fieldName: 'ExecutionDate', className:gridClasses.large1},
        // { key: 'RequestType', fieldName: 'RequestType', className:gridClasses.large1},
        { key: 'RequestArea', fieldName: 'RequestArea', className:gridClasses.large2},
        { key: 'AsignedManager', fieldName: 'Asigned Manager', className:gridClasses.regular},
        { key: 'Tags', fieldName: 'Tags', className:gridClasses.large2},
        { key: 'Status', fieldName: 'Status', className:gridClasses.small2},
        { key: 'EditDelete', fieldName: '', className:gridClasses.small1},
    ];

    return(
        <div className="ms-Grid">
        <h2>Request List:</h2>
        <Table sortable aria-label="Table with sort" >

        <TableHeader>
            <TableRow className="ms-Grid-row">
            {columns.map((column) => (
                <TableHeaderCell 
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
            <TableRow className="ms-Grid-row" key={item.ID} onClick={() => props.handleUpdate(item)}>
                <TableCell className={gridClasses.regular} >{item.Title}</TableCell>
                {/* <TableCell className={gridClasses.hid} >{item.Description}</TableCell> */}
                <TableCell className={gridClasses.mid3} >{services.formattedDate(item.DueDate)}</TableCell>
                {/* <TableCell className={gridClasses.large1}>{formattedDate(item.ExecutionDate)}</TableCell> */}
                {/* <TableCell className={gridClasses.hid}>{item.RequestType}</TableCell> */}
                <TableCell className={gridClasses.large2}>{item.RequestArea}</TableCell>
                <TableCell className={gridClasses.regular}>{props.usersArray[item.AsignedManagerId]}</TableCell>
                <TableCell className={gridClasses.large2}>
                {item.Tags.map((tag:Tag, index:number) => (
                <span key={index}>{tag.Label} </span>
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