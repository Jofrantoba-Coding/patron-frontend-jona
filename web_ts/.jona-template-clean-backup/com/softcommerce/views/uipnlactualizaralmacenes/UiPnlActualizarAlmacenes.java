package com.softcommerce.views.uipnlactualizaralmacenes;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnRegContaCab;

import java.awt.Color;
import java.awt.Font;
import java.awt.event.MouseEvent;

import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JComboBox;
import javax.swing.JTextField;
import javax.swing.JButton;
import javax.swing.JScrollPane;
import javax.swing.table.DefaultTableModel;

import org.jdesktop.swingx.JXTable;
import org.jdesktop.swingx.decorator.HighlighterFactory;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JOptionPane;
import java.awt.GridBagLayout;
import java.awt.GridBagConstraints;
import java.awt.Insets;
import java.awt.event.ItemListener;
import java.awt.event.ItemEvent;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;

public class UiPnlActualizarAlmacenes extends JPanel  implements InterUiPnlActualizarAlmacenes {

    private static final long serialVersionUID = 1L;
    protected JLabel lblDocumento;
    protected JComboBox cboTipoDoc;
    protected JComboBox cboSerie;
    protected JTextField txtPreimpreso;
    protected JButton btnBuscar;
    protected JButton btnCambiarAlmacen;
    protected JScrollPane scrollPane;
    protected JXTable table;
    //private JButton btnAceptar;
    //private JButton btnCancelar;
    protected DefaultTableModel modelo;
    protected CuadroMensaje cuadro;
    protected Usuario usuario;
    protected JPanel panel;
    protected JPanel panel_1;
    protected Main frmMain;

    public UiPnlActualizarAlmacenes(Usuario user, Main frm) {
        this.frmMain = frm;
        usuario = user;
        cuadro = new CuadroMensaje();
        GridBagLayout gridBagLayout = new GridBagLayout();
        gridBagLayout.columnWidths = new int[]{514, 0};
        gridBagLayout.rowHeights = new int[]{33, 187, 33, 0};
        gridBagLayout.columnWeights = new double[]{0.0, Double.MIN_VALUE};
        gridBagLayout.rowWeights = new double[]{0.0, 0.0, 0.0, Double.MIN_VALUE};
        setLayout(gridBagLayout);
        GridBagConstraints gbc_panel_1 = new GridBagConstraints();
        gbc_panel_1.fill = GridBagConstraints.BOTH;
        gbc_panel_1.insets = new Insets(0, 0, 5, 0);
        gbc_panel_1.gridx = 0;
        gbc_panel_1.gridy = 0;
        add(getPanel_1(), gbc_panel_1);
        GridBagConstraints gbc_scrollPane = new GridBagConstraints();
        gbc_scrollPane.weighty = 0.5;
        gbc_scrollPane.weightx = 0.5;
        gbc_scrollPane.fill = GridBagConstraints.BOTH;
        gbc_scrollPane.insets = new Insets(0, 0, 5, 0);
        gbc_scrollPane.gridx = 0;
        gbc_scrollPane.gridy = 1;
        add(getScrollPane(), gbc_scrollPane);
        GridBagConstraints gbc_panel = new GridBagConstraints();
        gbc_panel.weightx = 0.5;
        gbc_panel.fill = GridBagConstraints.BOTH;
        gbc_panel.gridx = 0;
        gbc_panel.gridy = 2;
        add(getPanel(), gbc_panel);
    }

    protected JLabel getLblDocumento() {
        if (lblDocumento == null) {
            lblDocumento = new JLabel("Documento:");
            lblDocumento.setBounds(4, 4, 60, 22);
        }
        return lblDocumento;
    }

    protected JComboBox getCboTipoDoc() {
        if (cboTipoDoc == null) {
            cboTipoDoc = new JComboBox();
            cboTipoDoc.addItemListener(new ItemListener() {
                @Override
                public void itemStateChanged(ItemEvent arg0) {
                    loadSerie(cboTipoDoc.getSelectedItem().toString().equals("BOLETA") ? "03" : "01");
                }
            });
            cboTipoDoc.setBounds(70, 4, 120, 22);
            cboTipoDoc.addItem("BOLETA");
            cboTipoDoc.addItem("FACTURA");
        }
        return cboTipoDoc;
    }

    protected JComboBox getCboSerie() {
        if (cboSerie == null) {
            cboSerie = new JComboBox();
            cboSerie.setBounds(194, 4, 52, 22);
        }
        return cboSerie;
    }

    protected JTextField getTxtPreimpreso() {
        if (txtPreimpreso == null) {
            txtPreimpreso = new JTextField();
            txtPreimpreso.setDocument(new IntegerDocument(10));
            txtPreimpreso.addFocusListener(new FocusAdapter() {
                @Override
                public void focusLost(FocusEvent arg0) {
                    if (txtPreimpreso.getText().trim().length() > 0) {
                        while (txtPreimpreso.getText().trim().length() < 10) {
                            txtPreimpreso.setText("0" + txtPreimpreso.getText().trim());
                        }
                    }
                }
            });
            txtPreimpreso.setBounds(249, 4, 84, 22);
            txtPreimpreso.setColumns(10);
        }
        return txtPreimpreso;
    }

    protected JButton getBtnBuscar() {
        return null;
    }

    protected JButton getBtnCambiarAlmacen() {
        if (btnCambiarAlmacen == null) {
            btnCambiarAlmacen = new JButton("Cambiar Almacen");
            btnCambiarAlmacen.setBounds(427, 4, 120, 22);
            btnCambiarAlmacen.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    int fila = getTable().getSelectedRow();

                    if (fila != -1) {
                        String id_item = getTable().getValueAt(fila, 2).toString();
                        String id_almacen = getTable().getValueAt(fila, 10).toString();
                        JDSeleccionaAlmacen frm = new JDSeleccionaAlmacen(id_item, id_almacen, frmMain);
                        frm.setVisible(true);
                        if (frm.getSwAceptar() == true) {
                            ItemObject itAlmacen = frm.getAlmacen();
                            if (ActualizaAlmacen(fila, itAlmacen.getId(), id_almacen)) {
                                //getTable().setValueAt(itAlmacen.getId(), fila, 10);
                                //getTable().setValueAt(itAlmacen.getDescription(), fila, 4);
                                cargarTabla();
                            }
                        }
                    }

                }
            });
        }
        return btnCambiarAlmacen;
    }

    protected JScrollPane getScrollPane() {
        if (scrollPane == null) {
            scrollPane = new JScrollPane();
            scrollPane.setViewportView(getTable());
        }
        return scrollPane;
    }

    protected JXTable getTable() {
        if (table == null) {
            table = new JXTable() {
                private static final long serialVersionUID = 1L;

                @Override
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
        String[] columnas = {"F. EMISION", "Nº DOCUMENTO", "ID_ITEM", "PRODUCTO", "ALMACEN", "ID_SECUENCIA", "ID_TIPO_DOC", "SERIE", "PREIMPRESO", "ID_REGCONTA_CAB", "ID_ALMACEN"};

        modelo = new DefaultTableModel(null, columnas);
        getTable().setModel(modelo);

        getTable().getColumn(0).setMinWidth(80);
        getTable().getColumn(0).setMaxWidth(80);

        getTable().getColumn(1).setMinWidth(120);
        getTable().getColumn(1).setMaxWidth(120);

        getTable().getColumn(2).setMinWidth(0);
        getTable().getColumn(2).setMaxWidth(0);

        getTable().getColumn(3).setMinWidth(200);
        getTable().getColumn(3).setMaxWidth(200);

        getTable().getColumn(5).setMinWidth(0);
        getTable().getColumn(5).setMaxWidth(0);

        getTable().getColumn(6).setMinWidth(0);
        getTable().getColumn(6).setMaxWidth(0);

        getTable().getColumn(7).setMinWidth(0);
        getTable().getColumn(7).setMaxWidth(0);

        getTable().getColumn(8).setMinWidth(0);
        getTable().getColumn(8).setMaxWidth(0);

        getTable().getColumn(9).setMinWidth(0);
        getTable().getColumn(9).setMaxWidth(0);

        getTable().getColumn(10).setMinWidth(0);
        getTable().getColumn(10).setMaxWidth(0);
    }

    public void cargarTabla() {
    }

    protected JPanel getPanel() {
        if (panel == null) {
            panel = new JPanel();
            panel.setLayout(null);
            //panel.add(getBtnAceptar());
            //panel.add(getBtnCancelar());
        }
        return panel;
    }

    protected JPanel getPanel_1() {
        if (panel_1 == null) {
            panel_1 = new JPanel();
            panel_1.setLayout(null);
            panel_1.add(getLblDocumento());
            panel_1.add(getCboTipoDoc());
            panel_1.add(getCboSerie());
            panel_1.add(getTxtPreimpreso());
            panel_1.add(getBtnBuscar());
            panel_1.add(getBtnCambiarAlmacen());
        }
        return panel_1;
    }

    public void loadSerie(String id_tipo_doc) {
    }

    public void setUsuario(Usuario user) {
        usuario = user;
    }

    protected boolean ActualizaAlmacen(int fila, String id_almacen, String id_almacen_ant) {
        return false;
    }
}
