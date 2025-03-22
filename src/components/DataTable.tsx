import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  TableSortLabel,
  TablePagination,
} from "@mui/material";

import './DataTable.css';

interface constant {
  ACTIVE: string;
  INVITED: string;
  BLOCKED: string;
}

const STATUS: constant = {
  ACTIVE: "ACTIVE",
  INVITED: "INVITED",
  BLOCKED: "BLOCKED",
};
const generateData = () => {
  const statuses = [STATUS.ACTIVE, STATUS.INVITED, STATUS.BLOCKED];
  const data = [];
  for (let i = 1; i <= 100; i++) {
    const randomUser = Math.ceil(Math.random() * 1000);
    data.push({
      id: i,
      about: {
        name: `User ${randomUser}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        email: `user${randomUser}@example.com`,
      },
      details: {
        date: new Date(
          Math.floor(Math.random() * (2025 - 2001 + 1)) + 2001,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toISOString(),
        invitedBy: `Admin ${randomUser}`,
      },
    });
  }
  return data;
};



const DataTable = () => {
  const [data, setData] = useState(generateData());
  const [filteredData, setFilteredData] = useState(data);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, searchText, dateRange, data]);

  const applyFilters = () => {
    let newData = [...data];

    if (statusFilter) {
      newData = newData.filter((row) => row.about.status === statusFilter);
    }

    if (searchText) {
      newData = newData.filter((row) =>
        row.about.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (dateRange.start || dateRange.end) {
      newData = newData.filter((row) => {
        const rowDate = new Date(row.details.date);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        return (
          (!startDate || rowDate >= startDate) &&
          (!endDate || rowDate <= endDate)
        );
      });
    }

    setFilteredData(newData);
    setSortConfig({ key: "id", direction: "asc" });
  };

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const getValue = (obj: any, path: string) =>
      path.split(".").reduce((acc, part) => acc && acc[part], obj);

    const sortedData = [...filteredData].sort((a, b) => {
      const aValue = getValue(a, key);
      const bValue = getValue(b, key);

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue, undefined, { numeric: true })
          : bValue.localeCompare(aValue, undefined, { numeric: true });
      }

      return direction === "asc" ? aValue - bValue : bValue - aValue;
    });

    setSortConfig({ key, direction });
    setFilteredData(sortedData);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    const updatedData = data.map((row) =>
      row.id === id
        ? { ...row, about: { ...row.about, status: newStatus } }
        : row
    );
    setData(updatedData);
  };

  const inactiveCount = data.filter(
    (row) => row.about.status !== STATUS.ACTIVE
  ).length;
  const inactivePercentage = (
    (inactiveCount / data.length) *
    100
  ).toFixed(2);

  const activeCount = data.filter(
    (row) => row.about.status === STATUS.ACTIVE).length;
  const blockedUser = data.filter(
    (row) => row.about.status === STATUS.BLOCKED).length;

  return (
    <div style={{padding: "2rem"}}>
      <h5><b>User Details</b></h5>
      <div style={{display: "flex",gap:"1rem",marginBottom: "1rem",marginTop: "1rem"}}>
        <div>{`Total User: ${data.length}`} </div>
        <div>{`Active User: ${activeCount}`} </div>
        <div>{`Inactive User: ${data.length-activeCount}`} </div>
        <div>{`Blocked User: ${blockedUser}`} </div>
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
        <TextField
          label="Search Name"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value={STATUS.ACTIVE}>{STATUS.ACTIVE}</MenuItem>
          <MenuItem value={STATUS.INVITED}>{STATUS.INVITED}</MenuItem>
          <MenuItem value={STATUS.BLOCKED}>{STATUS.BLOCKED}</MenuItem>
        </Select>
        <TextField
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          size="small"
          onChange={(e) =>
            setDateRange({ ...dateRange, start: e.target.value })
          }
        />
        <TextField
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          size="small"
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["id", "about.name", "about.status", "about.email", "details.date", "details.invitedBy"].map((key) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={sortConfig.key === key}
                    direction={sortConfig.direction}
                    onClick={() => handleSort(key)}
                  >
                    {key.split(".").pop()?.replace(/_/g, " ")}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.about.name}</TableCell>
                <TableCell>{row.about.status}</TableCell>
                <TableCell>{row.about.email}</TableCell>
                <TableCell>{new Date(row.details.date).toLocaleDateString()}</TableCell>
                <TableCell>{row.details.invitedBy}</TableCell>
                <TableCell>
                  <Select
                    value={row.about.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value={STATUS.ACTIVE}>{STATUS.ACTIVE}</MenuItem>
                    <MenuItem value={STATUS.INVITED}>{STATUS.INVITED}</MenuItem>
                    <MenuItem value={STATUS.BLOCKED}>{STATUS.BLOCKED}</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10]}
      />

      <p>Inactive Users: {inactivePercentage}%</p>
    </div>
  );
};

export default DataTable;

