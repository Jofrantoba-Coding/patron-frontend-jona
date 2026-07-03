/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneltfvendedor;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.controles.JHInternalFrame;
import com.softcommerce.general.controles.PopupMenuView;
import com.softcommerce.general.controles.Register;
import com.softcommerce.general.controles.RowSelection;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.controles.View;
import com.softcommerce.general.tablas.AnexoTableModel;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.util.render.CellRender;
import com.softcommerce.util.render.CellRendererImageEstado;
import com.softcommerce.util.ExportExcel;
import com.softcommerce.util.Imagenes;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.RowFilter;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFVendedor extends JHInternalFrame implements InterUiPanelTFVendedor, View, ListSelectionListener, RowSelection, ControlView, WindowListener, FocusListener, KeyListener, ActionListener {

    public CTable table;
    public AnexoTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    public JScrollPane scroll;
    protected JTextField txt_idanexo;
    protected JTextField txt_descripcionanexo;
    protected JTextField txt_tmpruc;
    protected JTextField txt_numlicencia;
    protected JComboBox cbo_tipopersona;
    protected Usuario usuario;
    protected int registro_inicial = 1;
    protected int numero_registros = 29;
    protected int total_registros;
    protected int total_paginas;
    protected JFrame frame;
    protected Date fechaInicio;
    protected Date fechaFin;

    public UiPanelTFVendedor(String title, JFrame frame, Usuario usuario) {
        super(title);
        this.usuario = usuario;
        this.frame = frame;
        inicialize();
    }

    protected void inicialize() {
        modeltable = new AnexoTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        PopupMenuView popupmenu = new PopupMenuView();
        popupmenu.setControl(this);
        table.setComponentPopupMenu(popupmenu);
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);

        table.setNoVisibleColumn(2);
        table.setNoVisibleColumn(4);
        table.setNoVisibleColumn(5);
        table.setNoVisibleColumn(6);
        table.setNoVisibleColumn(7);
        table.setNoVisibleColumn(9);
        table.setNoVisibleColumn(10);
        table.setNoVisibleColumn(12);
        table.setNoVisibleColumn(13);
        table.setNoVisibleColumn(14);
        table.setNoVisibleColumn(15);
        table.setNoVisibleColumn(16);
        table.setNoVisibleColumn(17);
        table.setNoVisibleColumn(18);
        table.setNoVisibleColumn(19);
        table.setNoVisibleColumn(20);
        table.setNoVisibleColumn(21);
        table.setNoVisibleColumn(22);
        table.setNoVisibleColumn(23);
        table.setNoVisibleColumn(24);
        table.setNoVisibleColumn(25);
        table.setNoVisibleColumn(26);
        table.setNoVisibleColumn(27);
        table.setNoVisibleColumn(28);
        table.setNoVisibleColumn(29);
        table.setNoVisibleColumn(30);
        table.setNoVisibleColumn(31);
        table.setNoVisibleColumn(32);

        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == 127) {
                    //controlEliminate();
                } else {
                    e.getKeyCode();
                }
            }
        });

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));

        JPanel panel = getPanelFilter();
        //panel.setPreferredSize(new Dimension(1200, 100));
        pnlaux.add(panel, BorderLayout.NORTH);

        scroll.setPreferredSize(new Dimension(1200,380));
        pnlaux.add(scroll,BorderLayout.CENTER);

        setTable(pnlaux);
    }
    
    protected void addGrid(JPanel pnl,GridBagConstraints gbc, int x, int y, JComponent component) {
        gbc.gridx = x;
        gbc.gridy = y;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnl.add(component, gbc);
    }

    public JPanel getPanelFilter()
    {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130,135,144)));
        //pnlp.setLayout(null);
        pnlp.setLayout(new GridBagLayout());
        
        GridBagConstraints gbc=new GridBagConstraints();
        gbc.weightx = 1.0;
        gbc.weighty = 1.0; 
        
        JToolBar tool1= new JToolBar();
        tool1.setFloatable(false);

        JToolBar tool2= new JToolBar();
        tool2.setFloatable(false);
              
        
        JLabel lbl_CodigoItem = new JLabel("Código ");
        //lbl_CodigoItem.setBounds(25,25,40,20);
        //lbl_CodigoItem.setFont(new Font("Verdana",0,11));
        tool1.add(lbl_CodigoItem);

        txt_idanexo = new JTextField(10);
	//txt_idanexo.setBounds(80,25,90,20);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.addFocusListener(this);
        txt_idanexo.setDocument(new UpperCaseNumberDocument(255));
        //txt_idanexo.setFont(new Font("Garamond",0,14));
        tool1.add(txt_idanexo);

        JLabel lbl_CodigoAlterno = new JLabel("     DNI/RUC ");
        //lbl_CodigoAlterno.setBounds(210,25,70,20);
        //lbl_CodigoAlterno.setFont(new Font("Verdana",0,11));
        tool1.add(lbl_CodigoAlterno);

        txt_tmpruc = new JTextField(10);
	//txt_tmpruc.setBounds(275,25,90,20);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.addKeyListener(this);
        txt_tmpruc.setDocument(new UpperCaseNumberDocument(255));
        //txt_tmpruc.setFont(new Font("Garamond",0,14));
        tool1.add(txt_tmpruc);

        JLabel lblItem= new JLabel("    R. Social ");
        //lblItem.setFont(new Font("Verdana",0,11));
        //lblItem.setBounds(425,25,50,20);
        tool1.add(lblItem);

        txt_descripcionanexo= new JTextField(25);
        //txt_descripcionanexo.setBounds(485,25,360,20);
        txt_descripcionanexo.addFocusListener(this);
        txt_descripcionanexo.setDocument(new UpperCaseNumberDocument(255));
        //txt_descripcionanexo.setFont(new Font("Garamond",0,14));
        txt_descripcionanexo.addKeyListener(this);
        tool1.add(txt_descripcionanexo);
        addGrid(pnlp, gbc, 0, 0, tool1);
        
        JLabel lbl_familia = new JLabel("T. Persona ");
        //lbl_familia.setFont(new Font("Verdana",0,11));
        //lbl_familia.setBounds(870,25,65,20);
        tool2.add(lbl_familia);

        cbo_tipopersona = new JComboBox();
        //cbo_tipopersona.setBounds(935,25,180,20);
        cbo_tipopersona.addActionListener(this);
        cbo_tipopersona.addKeyListener(this);
        tool2.add(cbo_tipopersona);

        JLabel lblRazonSocial = new JLabel("     Nº Licencia ");
        lblRazonSocial.setBounds(25,55,70,20);
        tool2.add(lblRazonSocial);

        txt_numlicencia = new JTextField(10);
        //txt_numlicencia.setBounds(95,55,120,20);
        txt_numlicencia.addKeyListener(this);
        txt_numlicencia.setDocument(new UpperCaseNumberDocument(250));
        txt_numlicencia.setMaximumSize(new Dimension(150, 25));
        txt_numlicencia.addFocusListener(this);
        tool2.add(txt_numlicencia);
        addGrid(pnlp, gbc, 0, 1, tool2);
        return pnlp;
    }

    protected String getParametro() {
        String parametro = "SELECT AN.ID_ANEXO,AN.DESCRIPCION,AN.NUMERO,AN.DIRECCION "
                + "FROM ANEXO AN "
                + "WHERE AN.\"_ESTADO\" = \'A\' "
                + "AND AN.ID_TIPO_ANEXO = \'8\' "
                + "AND AN.ID_EMPRESA = \'" + usuario.getCodempresa() + "\' ";

        if (cbo_tipopersona.getSelectedIndex() > 0) {
            parametro = parametro + " AND AN.FLAG_TIPO_PERSONA = \'" + (cbo_tipopersona.getSelectedIndex() == 1 ? "N" : "S") + "\' ";
        }

        if (txt_descripcionanexo.getText().trim().length() > 0) {
            parametro = parametro + " AND AN.DESCRIPCION LIKE \'%" + txt_descripcionanexo.getText().trim() + "%\' ";
        }

        if (txt_idanexo.getText().trim().length() > 0) {
            parametro = parametro + " AND AN.ID_ANEXO LIKE \'%" + txt_idanexo.getText().trim() + "%\' ";
        }

        if (txt_tmpruc.getText().trim().length() > 0) {
            parametro = parametro + " AND AN.NUMERO LIKE \'%" + txt_tmpruc.getText().trim() + "%\' ";
        }

        if (txt_numlicencia.getText().trim().length() > 0) {
            parametro = parametro + " AND AN.NRO_LICENCIA LIKE \'%" + txt_numlicencia.getText().trim() + "%\' ";
        }

        parametro = parametro + "ORDER BY AN.DESCRIPCION,AN.NUMERO ";

        return parametro;
    }

    @Override
    public void controlReport(boolean export) {
    }

    public void filtrar() {
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_descripcionanexo)
                    || (e.getSource() == txt_tmpruc)
                    || (e.getSource() == txt_numlicencia)
                    || (e.getSource() == txt_idanexo)) {
                filtrar();
            }
        }
    }

    public RowFilter getFilter() {
        return null;
    }

    public void cargarFiltro() {
    }

    public void loadCondPago() {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_descripcionanexo) {
            txt_descripcionanexo.selectAll();
        }

        if (e.getSource() == txt_tmpruc) {
            txt_tmpruc.selectAll();
        }

        if (e.getSource() == txt_idanexo) {
            txt_idanexo.selectAll();
        }

        if (e.getSource() == txt_numlicencia) {
            txt_numlicencia.selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == cbo_tipopersona) {
            if (cbo_tipopersona.getItemCount() > 0) {
                if (cbo_tipopersona.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    @Override
    public void controlPrint(boolean view) {
    }

    @Override
    public void controlAdd() {
    }

    @Override
    public void controlModify() {
    }

    @Override
    public void controlNullify() {
    }

    @Override
    public void controlEliminate() {
    }

    @Override
    public void controlClone() {
    }

    @Override
    public void controlDetails() {
    }

    @Override
    public void controlClose() {
    }

    @Override
    public void controlRefresh() {
    }

    @Override
    public Object getSelectedValue(int column) {
        return null;
    }

    @Override
    public void setSelectedRow(int row) {
        if (row >= 0) {
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
        if (!e.getValueIsAdjusting()) {
            refresh();
        }
    }

    @Override
    public int getSelectedRow() {
        return table.getSelectedRow();
    }

    @Override
    public void selectNextRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() < table.getRowCount() - 1) {
                int row = table.getSelectedRow() + 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectPreviusRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() > 0) {
                int row = table.getSelectedRow() - 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectLastRow() {
        if (table.getRowCount() > 0) {
            int rowCount = table.getRowCount() - 1;
            table.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }

    @Override
    public void selectFirstRow() {
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    public void setScrollValueView(int row) {
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    @Override
    public int getRowCount() {
        return table.getRowCount();
    }

    public void cargarTabla() {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idanexo && txt_idanexo.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idanexo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_idanexo.setText(nuevaserie);

            filtrar();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txt_idanexo) {
                txt_tmpruc.requestFocus();
            }

            if (e.getSource() == txt_tmpruc) {
                txt_descripcionanexo.requestFocus();
            }

            if (e.getSource() == txt_descripcionanexo) {
                cbo_tipopersona.requestFocus();
            }

            if (e.getSource() == cbo_tipopersona) {
                txt_numlicencia.requestFocus();
            }
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void refreshTitleName() {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void controlSearch() {
    }

    @Override
    public void windowOpened(WindowEvent e) {
    }

    @Override
    public void windowClosing(WindowEvent e) {
    }

    @Override
    public void windowClosed(WindowEvent e) {
    }

    @Override
    public void windowIconified(WindowEvent e) {
    }

    @Override
    public void windowDeiconified(WindowEvent e) {
    }

    @Override
    public void windowActivated(WindowEvent e) {
    }

    @Override
    public void windowDeactivated(WindowEvent e) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void selectFirstPage() {
    }

    @Override
    public void selectPreviusPage() {
    }

    @Override
    public void selectNextPage() {
    }

    @Override
    public void selectLastPage() {
    }

    @Override
    public int getSelectedPage() {
        return 0;
    }

    @Override
    public int getPageCount() {
        return 0;
    }
}
