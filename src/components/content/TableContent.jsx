import { useState, useEffect } from 'react'
import tippy from 'tippy.js'
import '../../styles/TableContent.css'

/**
 * TableContent Component
 *
 * Content renderer for Table elements.
 * Handles editable table grid with dynamic rows/columns and headers.
 */
const TableContent = ({ content, onChange, isFocused, onDimPositioningButtons }) => {
  const [rows, setRows] = useState(content?.rows || 3)
  const [columns, setColumns] = useState(content?.columns || 4)
  const [tableData, setTableData] = useState(content?.data ||
    Array(3).fill(null).map(() => Array(4).fill(''))
  )
  const [hasColumnHeader, setHasColumnHeader] = useState(content?.hasColumnHeader || false)
  const [hasRowHeader, setHasRowHeader] = useState(content?.hasRowHeader || false)
  const [cellFocused, setCellFocused] = useState(false)

  // Initialize Tippy tooltips for toolbar buttons
  useEffect(() => {
    const buttons = document.querySelectorAll('.table-controls button[data-tooltip]')
    if (buttons.length > 0) {
      const instances = tippy(Array.from(buttons), {
        content: (reference) => reference.getAttribute('data-tooltip'),
        arrow: true,
        theme: 'dark',
        duration: [50, 0],
        placement: 'top',
        offset: [0, 8]
      })
      return () => {
        instances.forEach(instance => instance.destroy())
      }
    }
  }, [])

  const updateContent = (newRows, newColumns, newData, newHasColumnHeader, newHasRowHeader) => {
    if (onChange) {
      onChange({
        rows: newRows,
        columns: newColumns,
        data: newData,
        hasColumnHeader: newHasColumnHeader !== undefined ? newHasColumnHeader : hasColumnHeader,
        hasRowHeader: newHasRowHeader !== undefined ? newHasRowHeader : hasRowHeader
      })
    }
  }

  const toggleColumnHeader = () => {
    const newValue = !hasColumnHeader
    setHasColumnHeader(newValue)
    updateContent(rows, columns, tableData, newValue, hasRowHeader)
  }

  const toggleRowHeader = () => {
    const newValue = !hasRowHeader
    setHasRowHeader(newValue)
    updateContent(rows, columns, tableData, hasColumnHeader, newValue)
  }

  const addRow = () => {
    const newRows = rows + 1
    const newData = [...tableData, Array(columns).fill('')]
    setRows(newRows)
    setTableData(newData)
    updateContent(newRows, columns, newData)
  }

  const removeRow = () => {
    if (rows > 1) {
      const newRows = rows - 1
      const newData = tableData.slice(0, -1)
      setRows(newRows)
      setTableData(newData)
      updateContent(newRows, columns, newData)
    }
  }

  const addColumn = () => {
    const newColumns = columns + 1
    const newData = tableData.map(row => [...row, ''])
    setColumns(newColumns)
    setTableData(newData)
    updateContent(rows, newColumns, newData)
  }

  const removeColumn = () => {
    if (columns > 1) {
      const newColumns = columns - 1
      const newData = tableData.map(row => row.slice(0, -1))
      setColumns(newColumns)
      setTableData(newData)
      updateContent(rows, newColumns, newData)
    }
  }

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = tableData.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? value : cell
      )
    )
    setTableData(newData)
    updateContent(rows, columns, newData)
  }

  const handleCellFocus = () => {
    setCellFocused(true)
    if (onDimPositioningButtons) {
      onDimPositioningButtons(true)
    }
  }

  const handleCellBlur = () => {
    setCellFocused(false)
    if (onDimPositioningButtons) {
      onDimPositioningButtons(false)
    }
  }

  return (
    <div className={`table-content ${cellFocused ? 'editing' : ''}`}>
      <div className={`table-controls ${cellFocused ? 'visible' : ''}`}>
        <div className="toolbar-group">
          <span className="toolbar-label">Rijen</span>
          <button
            className="toolbar-btn-small"
            onClick={removeRow}
            onMouseDown={(e) => e.preventDefault()}
            disabled={rows <= 1}
            data-tooltip="Verwijder rij"
          >
            −
          </button>
          <span className="toolbar-value">{rows}</span>
          <button
            className="toolbar-btn-small"
            onClick={addRow}
            onMouseDown={(e) => e.preventDefault()}
            data-tooltip="Voeg rij toe"
          >
            +
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Kolommen</span>
          <button
            className="toolbar-btn-small"
            onClick={removeColumn}
            onMouseDown={(e) => e.preventDefault()}
            disabled={columns <= 1}
            data-tooltip="Verwijder kolom"
          >
            −
          </button>
          <span className="toolbar-value">{columns}</span>
          <button
            className="toolbar-btn-small"
            onClick={addColumn}
            onMouseDown={(e) => e.preventDefault()}
            data-tooltip="Voeg kolom toe"
          >
            +
          </button>
        </div>

        <div className="toolbar-group">
          <button
            className={`toolbar-btn ${hasColumnHeader ? 'active' : ''}`}
            onClick={toggleColumnHeader}
            onMouseDown={(e) => e.preventDefault()}
            data-tooltip="Kolomkop"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="1.5" rx="1"/>
              <rect x="3" y="3" width="14" height="4" fill="currentColor" fillOpacity="0.3" rx="1"/>
              <line x1="8" y1="7" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="12" y1="7" x2="12" y2="17" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <button
            className={`toolbar-btn ${hasRowHeader ? 'active' : ''}`}
            onClick={toggleRowHeader}
            onMouseDown={(e) => e.preventDefault()}
            data-tooltip="Rijkop"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="1.5" rx="1"/>
              <rect x="3" y="3" width="4" height="14" fill="currentColor" fillOpacity="0.3" rx="1"/>
              <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="editable-table">
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const isColumnHeader = hasColumnHeader && rowIndex === 0
                  const isRowHeader = hasRowHeader && colIndex === 0
                  const isHeader = isColumnHeader || isRowHeader

                  return (
                    <td
                      key={colIndex}
                      className={`${isColumnHeader ? 'column-header' : ''} ${isRowHeader ? 'row-header' : ''}`}
                    >
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onFocus={handleCellFocus}
                        onBlur={handleCellBlur}
                        placeholder=""
                        className={isHeader ? 'header-input' : ''}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableContent
