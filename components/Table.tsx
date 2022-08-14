import React, {HTMLAttributes, useEffect, useMemo, useState} from 'react';
import {RequireAtLeastOne} from '../helper/types';
import classNames from 'classnames';
import {Input} from './Input';
import {flatten, get} from '../helper/utils';
import {ChevronDownIcon, ChevronUpIcon, SearchIcon} from '@heroicons/react/solid';
import {IconButton} from './Button';
import {ChevronLeftIcon, ChevronRightIcon, DotsHorizontalIcon} from '@heroicons/react/outline';
import {LoadingIcon} from './Loading';

type TableProps = {
    columns: Array<TableColumn>;
    data: any[];
    search?: boolean;
    pagination?: boolean;
    order?: {
        key: string;
        direction: TableOrderDirection;
    },
    loading?: boolean;
}
type TableColumn = RequireAtLeastOne<{
    id?: string;
    title?: string;
    data?: string;
    render?: (data: any, row: TableRow) => JSX.Element | string | null;
    width?: number;
    className?: HTMLAttributes<HTMLDivElement>['className'];
    contentClassName?: HTMLAttributes<HTMLDivElement>['className'];
    truncate?: boolean;
    minWidth?: number;
    icon?: React.ReactElement;
}, 'id' | 'data'>
type TableRow = {
    [key: string|number]: any;
};

type TableContext = TableProps & {
    order: {
        key: string;
        direction: TableOrderDirection;
    },
    changeOrder(key: string): void;
}
type TableOrderDirection = 'asc' | 'desc';

const Column = ({column, tableContext}: {column: TableColumn, tableContext: TableContext}) => {
	return (
		<th
			className={classNames('px-6 py-3 text-xs font-medium bg-gray-100 text-gray-500 uppercase tracking-wider border-b border-gray-200 select-none', {
				'cursor-pointer': column.data,
			}, column.className)}
			onClick={() => {
				if (column.data) tableContext.changeOrder(column.data);
			}}
			style={{
				width: typeof column.width === 'number' ? (column.width > 0 ? `${column.width*100}%` : undefined) : (column.width || '99%'),
				minWidth: column.minWidth,
			}}
		>
			<div className="flex items-center">
				{column.icon && React.cloneElement(column.icon, {
					className: classNames(column.icon.props.className, 'w-4 h-4 mr-1')
				})}
				<div className="flex-grow">{column.title}</div>
				{tableContext.order.key === column.data && (
					<div>
						{tableContext.order.direction === 'asc' ? (
							<ChevronDownIcon className="h-4 w-4"/>
						) : (
							<ChevronUpIcon className="h-4 w-4"/>
						)}
					</div>
				)}
			</div>
		</th>
	);
};
const Row = ({columns, row}: {columns: Array<TableColumn>, row: TableRow}) => {
	return (
		<tr>
			{columns.map((column, index) => {
				const value = column.render ? column.render(column.data ? get(row, column.data) : undefined, row) : column.data ? get(row, column.data) : null;
				// const isFirst = i === 0;
				// const isLast = i === columns.length-1;

				return (
					<td
						key={`column-${index}`}
						className={classNames('bg-white px-6 py-3 border-b border-gray-200', column.truncate && 'text-ellipsis overflow-hidden', column.className, column.contentClassName)}
					>
						{value}
					</td>
				);
			})}
		</tr>
	);
};

export const Table = (props: TableProps) => {
	const {columns, data, loading, pagination = true} = props;
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [pageLength] = useState(10);
	const [order, setOrder] = useState<{key: string, direction: TableOrderDirection}>({
		key: '',
		direction: 'asc',
	});

	const tableContext = {
		...props,
		order,
		changeOrder: (key: string) => {
			if (order.key === key) {
				if (order.direction === 'desc') {
					order.key = '';
				}

				order.direction = order.direction === 'asc' ? 'desc' : 'asc';
			}
			else {
				order.key = key;
				order.direction = 'asc';
			}

			setOrder({...order});
		},
	};

	const {rows, filtered} = useMemo(() => {
		let filtered = data;

		if (search) {
			filtered = filtered.filter((d) => Object.values(flatten(d)).join('').toLowerCase().indexOf(search.toLowerCase()) >= 0);
		}
		if (order.key) {
			filtered = filtered.sort((a, b) => {
				const aValue = get(a, order.key) || '';
				const bValue = get(b, order.key) || '';

				if (aValue > bValue) return 1;
				if (aValue < bValue) return -1;

				const aId = get(a, 'id') || '';
				const bId = get(b, 'id') || '';

				if (aId > bId) return 1;
				if (aId < bId) return -1;

				return 0;
			});

			if (order.direction === 'desc') {
				filtered = filtered.reverse();
			}
		}

		let rows = filtered;
		if (pagination) {
			const start = (page-1)*pageLength;
			const end = start + pageLength;

			rows = filtered.slice(start, end);
		}

		return {
			rows,
			filtered,
		};
	}, [data, order, search, page, pageLength]);

	const pages = useMemo(() => Math.max(Math.ceil(filtered.length/pageLength), 0), [filtered, pageLength]);

	useEffect(() => {
		if (props.order) {
			setOrder(props.order);
		}
	}, [props.order]);

	return (
		<>
			{props.search && (
				<div className="flex mb-2">
					<div className="flex-grow"/>

					<Input
						placeholder="Search..."
						value={search}
						onChange={(e) => setSearch(e.currentTarget.value)}
						LeftComponent={(
							<SearchIcon className="h-5 w-5"/>
						)}
					/>
				</div>
			)}
			<div className="rounded-lg shadow overflow-auto">
				<table className="table-fixed max-w-full">
					<thead>
						<tr>
							{columns.map((column, index) => (
								<Column
									key={`table-column-${index}`}
									column={column}
									tableContext={tableContext}
								/>
							))}
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={columns.length} className="bg-white text-gray-400 italic text-center px-6 py-3 border-b border-gray-200 text-sm" >
									<LoadingIcon className="mx-auto" />
								</td>
							</tr>
						) : (
							<>
								{rows.length === 0 && (
									<tr>
										<td colSpan={columns.length} className="bg-white text-gray-400 italic text-center px-6 py-3 border-b border-gray-200 text-sm" >
                                            No results
										</td>
									</tr>
								)}

								{rows.map((row, index) => (
									<Row
										key={`table-row-${index}`}
										row={row}
										columns={columns}
									/>
								))}
							</>
						)}
					</tbody>
				</table>
			</div>

			{pagination && (
				<div className="flex items-center justify-center mt-4">
					<Pagination
						selected={page}
						pages={pages}
						onChange={setPage}
					/>
				</div>
			)}
		</>
	);
};

type TablePaginationProps = {
    selected: number;
    pages: number;
    className?: string;
    siblings?: number;
    onChange?(page: number): void;
}
const Pagination = ({pages, selected, siblings = 1, className, ...props}: TablePaginationProps) => {
	const ranges = useMemo(() => {
		const range = (start: number, end: number) => {
			const length = end - start + 1;
			return Array.from({ length }, (_, idx) => idx + start);
		};

		const totalPageNumbers = siblings + 5;

		if (totalPageNumbers >= pages) {
			return range(1, pages);
		}

		const leftSiblingIndex = Math.max(selected - siblings, 1);
		const rightSiblingIndex = Math.min(
			selected + siblings,
			pages
		);

		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < pages - 2;

		const firstPageIndex = 1;
		const lastPageIndex = pages;

		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = 3 + 2 * siblings;
			const leftRange = range(1, leftItemCount);

			return [...leftRange, null, pages];
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {

			const rightItemCount = 3 + 2 * siblings;
			const rightRange = range(
				pages - rightItemCount + 1,
				pages
			);
			return [firstPageIndex, null, ...rightRange];
		}

		if (shouldShowLeftDots && shouldShowRightDots) {
			const middleRange = range(leftSiblingIndex, rightSiblingIndex);
			return [firstPageIndex, null, ...middleRange, null, lastPageIndex];
		}

		return [];
	}, [pages, siblings, selected]);

	useEffect(() => {
		if (pages > 0 && selected > pages) set(pages);
	}, [selected, pages]);

	const previous = () => {
		if (typeof props.onChange === 'function') props.onChange(Math.max(selected-1, 1));
	};
	const next = () => {
		if (typeof props.onChange === 'function') props.onChange(Math.min(selected+1, pages));
	};
	const set = (page: number) => {
		if (typeof props.onChange === 'function') props.onChange(page);
	};

	return (
		<div className={classNames('flex items-center', className)}>
			<IconButton
				icon={<ChevronLeftIcon/>}
				onClick={previous}
				disabled={selected <= 1}
			/>
			{ranges.map((index, i) => (
				index ? (
					<IconButton
						key={i}
						className="mx-1"
						label={`${index}`}
						color={index === selected ? 'primary' : 'default'}
						onClick={() => set(index)}
					/>
				) : (
					<div key={i} className="w-10 h-10 flex items-center justify-center mx-1">
						<DotsHorizontalIcon className="h-6 w-6 text-muted"/>
					</div>
				)
			))}
			<IconButton
				icon={<ChevronRightIcon/>}
				onClick={next}
				disabled={selected >= pages}
			/>
		</div>
	);
};
