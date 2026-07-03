/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipnldocumentocosteo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.DetalleCosteoMov;
import com.softcommerce.beans.DocumentoCosteo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.reglasnegocio.rn_DocumentoCosteo;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.ArrayList;
import java.util.List;
import javax.swing.*;
import javax.swing.border.TitledBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import org.jdesktop.swingx.JXTable;
import org.jdesktop.swingx.decorator.HighlighterFactory;

public class UiPnlDocumentoCosteo extends JPanel  implements InterUiPnlDocumentoCosteo {

    protected CuadroMensaje cuadro;
    protected java.net.URL path;
    protected Usuario usuario;
    protected JPanel panelmov;
    protected JComboBox cboMovimientos;
    protected JButton btnVerTodos;
    private static final long serialVersionUID = 1L;
    protected JButton btnGuardar;
    protected JScrollPane scrollPane;
    protected JLabel lblDescripcion;
    protected JXTable table;
    protected JPanel panel;
    protected DefaultTableModel modelo;
    protected String strFormula = "";
    protected JFrame frame;

    public UiPnlDocumentoCosteo(java.net.URL path, Usuario user, JFrame frame) {
        super();
        this.path = path;
        usuario = user;
        cuadro = new CuadroMensaje(usuario);
        this.frame = frame;

        GridBagLayout gridBagLayout = new GridBagLayout();
        gridBagLayout.columnWidths = new int[]{0, 0};
        gridBagLayout.rowHeights = new int[]{0, 0};
        gridBagLayout.columnWeights = new double[]{1.0, Double.MIN_VALUE};
        gridBagLayout.rowWeights = new double[]{0.0, Double.MIN_VALUE};
        setLayout(gridBagLayout);
        GridBagConstraints gbc_panel = new GridBagConstraints();
        gbc_panel.fill = GridBagConstraints.BOTH;
        gbc_panel.gridx = 0;
        gbc_panel.gridy = 0;
        add(getpanelmov(), gbc_panel);


        //Tabla:
        GridBagConstraints gbc_Tabla = new GridBagConstraints();
        gbc_Tabla.gridx = 0;
        gbc_Tabla.gridy = 1;
        gbc_Tabla.weightx = 1.0;
        gbc_Tabla.weighty = 1.0;
        gbc_Tabla.insets = new Insets(5, 5, 5, 5);
        gbc_Tabla.fill = GridBagConstraints.BOTH;
        add(getPanel(), gbc_Tabla);

        ListarDocumentosCosteo("");
        ListarMovimientosInventario("");
    }

    protected JPanel getPanel() {
        if (panel == null) {
            panel = new JPanel(new GridBagLayout());
            //panel.setLayout(null);
            GridBagConstraints gbc = new GridBagConstraints();
            gbc.gridx = 0;
            gbc.gridy = 0;
            gbc.weightx = 2.0;
            gbc.weighty = 1.0;
            gbc.insets = new Insets(2, 2, 2, 2);
            gbc.fill = GridBagConstraints.BOTH;
            panel.add(getScrollPane(), gbc);

            GridBagConstraints gbd = new GridBagConstraints();
            gbd.gridx = 1;
            gbd.gridy = 1;
            gbd.weightx = 0;
            gbd.weighty = 0;
            gbd.insets = new Insets(2, 2, 2, 2);
            gbd.fill = GridBagConstraints.NONE;
            panel.add(getBtnGuardar(), gbd);
            //panel.add(getPnlBusqueda());

            GridBagConstraints gbe = new GridBagConstraints();
            gbe.gridx = 0;
            gbe.gridy = 1;
            gbe.weightx = 1.0;
            gbe.weighty = 0;
            gbe.insets = new Insets(2, 10, 2, 10);
            gbe.fill = GridBagConstraints.HORIZONTAL;
            panel.add(getLblDescripcion(), gbe);
            //panel.add(getPnlBusqueda());
        }
        return panel;
    }

    protected JLabel getLblDescripcion() {
        if (lblDescripcion == null) {
            lblDescripcion = new JLabel("Formula: ");
            lblDescripcion.setSize(350, 22);
            //lblDescripcion.setPreferredSize(new Dimension(350, 22));
        }
        return lblDescripcion;
    }

    protected JScrollPane getScrollPane() {
        if (scrollPane == null) {
            scrollPane = new JScrollPane();
            //scrollPane.setBounds(20, 102, 1000, 264);
            scrollPane.setViewportView(getTable());
        }
        return scrollPane;
    }

    public JButton getBtnGuardar() {
        if (btnGuardar == null) {
            btnGuardar = new JButton();
            btnGuardar.setText("Guardar");
            btnGuardar.setSize(100, 22);
            btnGuardar.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    ItemObject it = (ItemObject) getCboMovimientos().getSelectedItem();

                    List<DetalleCosteoMov> Lista = new ArrayList<DetalleCosteoMov>();
                    for (int i = 0; i < getTable().getRowCount(); i++) {
                        if (getTable().getValueAt(i, 4).equals(true)) {
                            DetalleCosteoMov d = new DetalleCosteoMov();
                            d.setCodigo_cod(Integer.parseInt(getTable().getValueAt(i, 0).toString()));
                            d.setId_tipo_mov(it.getId());
                            d.setDescripcion_com(strFormula);

                            Lista.add(d);
                        }

                    }

                    InsertaRegistro(Lista, it.getId());
                }
            });
        }
        return btnGuardar;
    }

    protected JXTable getTable() {
        if (table == null) {
            table = new JXTable() {
                /**
                 *
                 */
                private static final long serialVersionUID = 1L;
                Class[] type = {java.lang.Object.class, java.lang.Object.class, java.lang.Object.class, java.lang.Object.class, java.lang.Boolean.class};

                @Override
                public Class getColumnClass(int columnIndex) {
                    return type[columnIndex];
                }

                @Override
                public boolean isCellEditable(int f, int c) {
                    if (c == 4) {
                        return true;
                    }
                    return false;
                }

                public String getToolTipText(MouseEvent e) {
                    String tip = null;
                    java.awt.Point p = e.getPoint();
                    int rowIndex = rowAtPoint(p);
                    int colIndex = columnAtPoint(p);

                    try {
                        if (colIndex != 0) {
                            tip = getValueAt(rowIndex, colIndex).toString();
                        }
                    } catch (RuntimeException e1) {
                    }
                    return tip;
                }
            };
            table.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    CreaFormula();
                }
            });
            table.setHorizontalScrollEnabled(true);
            table.setEditable(false);
            table.getTableHeader().setReorderingAllowed(false);
            table.setFont(new Font("Tahoma", Font.PLAIN, 11));
            table.setHighlighters(HighlighterFactory.createAlternateStriping(new Color(240, 248, 255), new Color(255, 255, 240)));
            InicializaTabla();
        }
        return table;
    }

    protected void InicializaTabla() {
        String[] columnas = {"ID",
            "DESCRIPCION DEL DOCUMENTO",
            "ABREVIATURA",
            "SIGNO",
            " "
        };



        modelo = new DefaultTableModel(null, columnas);

        getTable().setModel(modelo);

        getTable().getColumn(0).setMinWidth(60);
        getTable().getColumn(0).setMaxWidth(60);

        getTable().getColumn(1).setMinWidth(300);
        getTable().getColumn(1).setMaxWidth(300);

        getTable().getColumn(2).setMinWidth(70);
        getTable().getColumn(2).setMaxWidth(70);

        getTable().getColumn(3).setMinWidth(70);
        getTable().getColumn(3).setMaxWidth(70);

        getTable().getColumn(4).setMinWidth(70);
        getTable().getColumn(4).setMaxWidth(70);

        //NumberRenderer nr = new NumberRenderer(new DecimalFormat("#,##0.00"));
        //getTable().getColumn(5).setCellRenderer(nr);

        DefaultTableCellRenderer tcr = new DefaultTableCellRenderer();
        tcr.setHorizontalAlignment(SwingConstants.RIGHT);
        //getTable().getColumn(3).setCellRenderer(tcr);
        //getTable().getColumn(4).setCellRenderer(tcr);
        //getTable().getColumn(5).setCellRenderer(tcr);
    }

    /*ListarDocumentosCosteo*/
    protected void ListarDocumentosCosteo(String x_descripcion_doc) {
    }

    protected void ListarMovimientosInventario(String x_descripcion_doc) {
    }

    protected JPanel getpanelmov() {
        if (panelmov == null) {
            panelmov = new JPanel();
            panelmov.setBorder(new TitledBorder(null, "Movimientos", TitledBorder.LEADING, TitledBorder.TOP, null, null));
            GridBagLayout gbl_panel = new GridBagLayout();
            gbl_panel.columnWidths = new int[]{0, 0};
            gbl_panel.rowHeights = new int[]{0, 0};
            gbl_panel.columnWeights = new double[]{1.0, Double.MIN_VALUE};
            gbl_panel.rowWeights = new double[]{0.0, Double.MIN_VALUE};
            panelmov.setLayout(gbl_panel);
            GridBagConstraints gbc_cboMovimientos = new GridBagConstraints();
            gbc_cboMovimientos.fill = GridBagConstraints.HORIZONTAL;
            gbc_cboMovimientos.gridx = 0;
            gbc_cboMovimientos.gridy = 0;
            panelmov.add(getCboMovimientos(), gbc_cboMovimientos);
            GridBagConstraints gbc_button = new GridBagConstraints();
            gbc_button.fill = GridBagConstraints.HORIZONTAL;
            gbc_button.gridx = 1;
            gbc_button.gridy = 0;
            panelmov.add(getBtnVerTodos(), gbc_button);
        }
        return panelmov;
    }

    public JButton getBtnVerTodos() {
        if (btnVerTodos == null) {
            btnVerTodos = new JButton();
            btnVerTodos.setText("Ver todos");
            btnVerTodos.setSize(100, 22);
            btnVerTodos.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    PnlMostrarTipoMovimientosFormula frm = new PnlMostrarTipoMovimientosFormula(path, usuario, frame);
                    frm.setSize(750, 450);
                    frm.setVisible(true);

                }
            });
        }
        return btnVerTodos;
    }

    protected JComboBox getCboMovimientos() {
        if (cboMovimientos == null) {
            cboMovimientos = new JComboBox();
            cboMovimientos.addItemListener(new java.awt.event.ItemListener() {
                public void itemStateChanged(java.awt.event.ItemEvent evt) {
                    if (cboMovimientos.getItemCount() > 0) {
                        ItemObject it = (ItemObject) cboMovimientos.getSelectedItem();
                        CargaDatos(it.getId());
                    }
                }
            });
        }
        return cboMovimientos;
    }

    protected void CreaFormula() {
        strFormula = "";

        for (int i = 0; i < getTable().getRowCount(); i++) {
            if (table.getValueAt(i, 4).equals(true)) {
                strFormula = strFormula + table.getValueAt(i, 3).toString();
                strFormula = strFormula + table.getValueAt(i, 2).toString();
            }
        }

        getLblDescripcion().setText("Formula:" + strFormula);
    }

    protected void InsertaRegistro(List<DetalleCosteoMov> Lista, String id_tipo_mov) {
    }

    protected void LimpiaFormulario() {
        for (int i = 0; i < getTable().getRowCount(); i++) {
            getTable().setValueAt(false, i, 4);
        }
        getLblDescripcion().setText("Fórmula:");
    }

    public void CargaDatos(String id_tipo_mov) {
    }
}
