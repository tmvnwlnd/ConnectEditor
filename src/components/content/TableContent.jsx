import { useState } from 'react'
import { useContentField } from '../../hooks/useContentField'
import { Icon } from '../ds'
import { useTooltips } from '../../hooks/useTooltip'
import '../../styles/TableContent.css'
import '../../styles/ContentEditor.css'

/**
 * TableContent Component
 *
 * Content renderer for Table elements.
 * Handles editable table grid with dynamic rows/columns and headers.
 */
const TableContent = ({ content, onChange, isFocused, onDimPositioningButtons }) => {
  const [rows, setRows] = useContentField(content, 'rows', 3)
  const [columns, setColumns] = useContentField(content, 'columns', 4)
  const [tableData, setTableData] = useContentField(content, 'data', () =>
    Array(3).fill(null).map(() => Array(4).fill(''))
  )
  const [hasColumnHeader, setHasColumnHeader] = useContentField(content, 'hasColumnHeader', false)
  const [hasRowHeader, setHasRowHeader] = useContentField(content, 'hasRowHeader', false)
  const [cellFocused, setCellFocused] = useState(false)

  // Tooltips for this table's own toolbar buttons (scoped to this block).
  const controlsRef = useTooltips('top')

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
      <div ref={controlsRef} className={`table-controls ${cellFocused ? 'visible' : ''}`}>
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
            <Icon name="header-row" size={20} />
          </button>
          <button
            className={`toolbar-btn ${hasRowHeader ? 'active' : ''}`}
            onClick={toggleRowHeader}
            onMouseDown={(e) => e.preventDefault()}
            data-tooltip="Rijkop"
          >
            <Icon name="header-column" size={20} />
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
