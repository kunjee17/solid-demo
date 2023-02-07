import {Routes} from "@solidjs/router";
import {
    Component,
    createContext, createEffect,
    createResource,
    createSignal, For,
    Show,
} from "solid-js";
import {ColumnDef, createSolidTable, flexRender, getCoreRowModel, Row} from "@tanstack/solid-table";
import {Fragment} from "solid-js/h/jsx-runtime";

const getUsers = async () => {
    const res = await fetch(`${url}`);
    const resJ: User [] = await res.json();
    return resJ;
};


// Model
export type User = {
    id?: number
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
    kids : User []
};
export const url = `http://localhost:5000/users`;

const defaultColumns: ColumnDef<User>[] = [
    {
        header: "Single Inputs11",
        columns: [
            {
                id: 'expander',
                header: () => null,
                cell: ({row}) => {
                    return row.getCanExpand() ? (
                        <button
                            {...{
                                onClick: row.getToggleExpandedHandler(),
                                style: {cursor: 'pointer'},
                            }}
                        >
                            {row.getIsExpanded() ? '👇' : '👉'}
                        </button>
                    ) : (
                        '🔵'
                    )
                },
            },
            {
                accessorKey: 'firstName',
                header: 'First Name11',
                cell: info => info.getValue()
            },
            {
                accessorKey: 'lastName',
                header: 'Last Name11',
                cell: info => info.getValue()
            }
        ]
    },
    {
        accessorKey: 'firstName',
        cell: ({getValue, row: {index}, column: {id}, table}) => {
            const initialValue = getValue()
            const [value, setValue] = createSignal(initialValue);
            const onBlur = () => {
                console.log(index, id, value())
            }
            createEffect(() => {
                setValue(initialValue)
            }, [initialValue])
            return (
                <input
                    value={value() as string}
                    onChange={e => setValue(e.target.value)}
                    onfocusout={onBlur}
                />)
        },
        footer: info => info.column.id,
    },
    {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => <i>{info.getValue<string>()}</i>,
        header: () => <span>Last Name</span>,
        footer: info => info.column.id,
    },
    {
        accessorKey: 'age',
        header: () => 'Age',
        footer: info => info.column.id,
    },
    {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        footer: info => info.column.id,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        footer: info => info.column.id,
    },
    {
        accessorKey: 'progress',
        header: 'Profile Progress',
        footer: info => info.column.id,
    },
]

const renderSubComponent = ({row}: { row: Row<User> }) => {
    const table = createSolidTable({
        get data() {
            return row.original.kids || []
        },
        columns: defaultColumns,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <div class="p-2">
            <table>
                <thead>
                <For each={table.getHeaderGroups()}>
                    {headerGroup => (
                        <tr>
                            <For each={headerGroup.headers}>
                                {header => (
                                    <th>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                )}
                            </For>
                        </tr>
                    )}
                </For>
                </thead>
                <tbody>
                <For each={table.getRowModel().rows}>
                    {row => (
                        <Fragment>
                            <tr>
                                <For each={row.getVisibleCells()}>
                                    {cell => (
                                        <td>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )}
                                </For>
                            </tr>
                            {row.getIsExpanded() && (
                                <tr>
                                    {/* 2nd row is a custom 1 cell row */}
                                    <td colSpan={row.getVisibleCells().length}>
                                        {renderSubComponent({row})}
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    )}
                </For>
                </tbody>
                <tfoot>
                <For each={table.getFooterGroups()}>
                    {footerGroup => (
                        <tr>
                            <For each={footerGroup.headers}>
                                {header => (
                                    <th>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.footer,
                                                header.getContext()
                                            )}
                                    </th>
                                )}
                            </For>
                        </tr>
                    )}
                </For>
                </tfoot>
            </table>
            <div class="h-4"/>
        </div>
    )
}

const App: Component = () => {
    const [users, {refetch}] = createResource(getUsers);

    const table = createSolidTable({
        get data() {
            return users() || []
        },
        columns: defaultColumns,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div>
            <Show when={users.loading}>Loading...</Show>
            <Show when={users.latest}>
                <div class="p-2">
                    <table>
                        <thead>
                        <For each={table.getHeaderGroups()}>
                            {headerGroup => (
                                <tr>
                                    <For each={headerGroup.headers}>
                                        {header => (
                                            <th>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        )}
                                    </For>
                                </tr>
                            )}
                        </For>
                        </thead>
                        <tbody>
                        <For each={table.getRowModel().rows}>
                            {row => (
                                <Fragment>
                                    <tr>
                                        <For each={row.getVisibleCells()}>
                                            {cell => (
                                                <td>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            )}
                                        </For>
                                    </tr>
                                    {row.getIsExpanded() && (
                                        <tr>
                                            {/* 2nd row is a custom 1 cell row */}
                                            <td colSpan={row.getVisibleCells().length}>
                                                {renderSubComponent({row})}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            )}
                        </For>
                        </tbody>
                        <tfoot>
                        <For each={table.getFooterGroups()}>
                            {footerGroup => (
                                <tr>
                                    <For each={footerGroup.headers}>
                                        {header => (
                                            <th>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.footer,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        )}
                                    </For>
                                </tr>
                            )}
                        </For>
                        </tfoot>
                    </table>
                    <div class="h-4"/>
                    <button onClick={() => refetch()} class="border p-2">
                        Rerender
                    </button>
                </div>
            </Show>
        </div>
    );
};

export default App;
