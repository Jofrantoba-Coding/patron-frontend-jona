/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformaccionsocioagregar;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.AccionSocio;
import com.softcommerce.beans.Socio;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.tablas.SocioTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnCliente;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.border.LineBorder;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiFormAccionSocioAgregar extends JDialog implements InterUiFormAccionSocioAgregar, ActionListener, FocusListener, KeyListener {

    protected java.net.URL path;
    protected JButton btnAceptar;
    protected JButton btnRefrescar;
    protected JButton btnCancelar;
    public boolean swRegistro;
    protected JDateChooser dcFecha;
    protected Component comp;
    protected JTextField txtCantidad;
    protected JDialog dialogPadre;
    protected CTable tableSocio;
    protected SocioTableModel modeltableSocio;
    protected TableRowSorter modeloOrdenadoSocio;
    protected JTextField txt_codigo;
    protected JTextField txt_numero;
    protected JTextField txt_descripcion;
    protected Gif gif;

    public UiFormAccionSocioAgregar(JDialog arg0, java.net.URL path, Component comp, boolean swReg) {
        super(arg0);
        this.dialogPadre = arg0;
        this.path = path;
        this.comp = comp;
        this.swRegistro = swReg;
        initialize();
    }

    protected void initialize() {
        JPanel pnl = new JPanel();
        gif = new Gif();
        pnl.setLayout(new BorderLayout());
        setContentPane(pnl);

        modeltableSocio = new SocioTableModel();
        modeloOrdenadoSocio = new TableRowSorter(modeltableSocio);
        tableSocio = new CTable();
        tableSocio.setRowSorter(modeloOrdenadoSocio);
        tableSocio.setModel(modeltableSocio);
        tableSocio.setAllTableNoEditable();
        tableSocio.setAllColumnNoResizable();
        tableSocio.setRendererColumnZero();
        tableSocio.setAllColumnPreferredWidth();
        tableSocio.setNoVisibleColumn(2);
        tableSocio.setNoVisibleColumn(4);
        tableSocio.setNoVisibleColumn(5);
        tableSocio.setNoVisibleColumn(6);
        tableSocio.setNoVisibleColumn(7);
        tableSocio.setNoVisibleColumn(8);
        JScrollPane scrollSocio = new JScrollPane(tableSocio);

        //pnlaux.setLayout(new BorderLayout(0, 0));
        pnl.add(getPanelFilter(), BorderLayout.NORTH);

        scrollSocio.setPreferredSize(new Dimension(500, 250));
        pnl.add(scrollSocio, BorderLayout.CENTER);

        JPanel pnlSouth = new JPanel();
        pnlSouth.setLayout(new BorderLayout());
        pnl.add(pnlSouth, BorderLayout.SOUTH);

        JPanel pnlOpciones = new JPanel();
        pnlSouth.add(pnlOpciones, BorderLayout.SOUTH);
        JPanel pnlForm = new JPanel();
        pnlSouth.add(pnlForm, BorderLayout.CENTER);

        if (swRegistro) {
            btnAceptar = new JButton("Agregar", gif.ADD16);
        } else {
            btnAceptar = new JButton("Desactivar");
        }
        btnRefrescar = new JButton("Refrescar", gif.REFRESH16);
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        btnAceptar.setMnemonic('A');
        btnAceptar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAceptar.setIconTextGap(10);
        btnAceptar.setOpaque(false);
        btnAceptar.setFont(new Font(Font.SANS_SERIF, 0, 11));

        btnRefrescar.setMnemonic('R');
        btnRefrescar.setHorizontalAlignment(SwingConstants.LEFT);
        btnRefrescar.setIconTextGap(10);
        btnRefrescar.setOpaque(false);
        btnRefrescar.setFont(new Font(Font.SANS_SERIF, 0, 11));

        btnCancelar.setMnemonic('C');
        btnCancelar.setHorizontalAlignment(SwingConstants.LEFT);
        btnCancelar.setIconTextGap(10);
        btnCancelar.setOpaque(false);
        btnCancelar.setFont(new Font(Font.SANS_SERIF, 0, 11));

        pnlOpciones.add(btnAceptar);
        pnlOpciones.add(btnRefrescar);
        pnlOpciones.add(btnCancelar);

        JLabel lblCantidad = new JLabel("Cantidad");
        pnlForm.add(lblCantidad);
        txtCantidad = new JTextField();
        txtCantidad.setDocument(new DoubleDocument());
        txtCantidad.setColumns(5);
        pnlForm.add(txtCantidad);
        JLabel lblFecha = new JLabel("Fecha " + (swRegistro ? "Inicio" : "Fin"));
        pnlForm.add(lblFecha);
        dcFecha = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFecha.setDate(new java.util.Date());
        pnlForm.add(dcFecha);

        setTitle((swRegistro ? "Activar" : "Desactivar") + " Socio");
        setModal(true);
        cargarTabla();
        pack();
        ComponentToolKit.centerComponentPosicion(this);
        initListener();
        setVisible(true);
    }

    protected void initListener() {
        btnAceptar.addActionListener(this);
        btnRefrescar.addActionListener(this);
        btnCancelar.addActionListener(this);
        txt_codigo.addKeyListener(this);
        txt_codigo.addFocusListener(this);
        txt_numero.addKeyListener(this);
        txt_numero.addFocusListener(this);
        txt_descripcion.addKeyListener(this);
        txt_descripcion.addFocusListener(this);
        tableSocio.addKeyListener(this);
    }

    protected void cargarTabla() {
    }

    protected void filtrar() {
    }

    protected RowFilter getFilter() {
        return null;
    }

    protected JPanel getPanelFilter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JPanel pnlp = new JPanel();
        pnl.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);

        JLabel lbl_codigo = new JLabel("Código");
        lbl_codigo.setFont(new Font("Verdana", 0, 10));
        pnlp.add(lbl_codigo, gbc);

        txt_codigo = new JTextField();
        txt_codigo.setDocument(new IntegerDocument(10));
        txt_codigo.setFont(new Font("Garamond", 0, 14));
        txt_codigo.setColumns(7);
        gbc.gridx = 1;
        pnlp.add(txt_codigo, gbc);

        JLabel lbl_numero = new JLabel("DNI/RUC");
        lbl_numero.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 2;
        pnlp.add(lbl_numero, gbc);

        txt_numero = new JTextField();
        txt_numero.setDocument(new IntegerDocument(11));
        txt_numero.setFont(new Font("Garamond", 0, 14));
        txt_numero.setColumns(7);
        gbc.gridx = 3;
        pnlp.add(txt_numero, gbc);

        JLabel lbl_descripcion = new JLabel("R. Social");
        lbl_descripcion.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlp.add(lbl_descripcion, gbc);

        txt_descripcion = new JTextField();
        txt_descripcion.setDocument(new UpperCaseDocument(100));
        txt_descripcion.setFont(new Font("Garamond", 0, 14));
        txt_descripcion.setColumns(14);
        gbc.gridx = 5;
        pnlp.add(txt_descripcion, gbc);

        pnl.add(pnlp, BorderLayout.WEST);
        return pnl;
    }

    protected boolean verificarValido() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btnAceptar) {
            if (!verificarValido()) {
                return;
            }
            int row = tableSocio.getSelectedRow();
            if (row >= 0) {
                Socio beanSocio = new Socio();
                beanSocio = modeltableSocio.getSocio(tableSocio.convertRowIndexToModel(row));
                AccionSocio beanAccionSocio = new AccionSocio();
                beanAccionSocio.setEstado(swRegistro ? "A" : "D");
                java.util.Date fechaini = dcFecha.getDate();
                java.sql.Date fecha = new java.sql.Date(fechaini.getTime());
                if (swRegistro) {
                    beanAccionSocio.setFechaIni(fecha);
                    beanAccionSocio.setPrecio(new BigDecimal(BigInteger.ZERO));
                    beanAccionSocio.setCantidad(new BigDecimal(txtCantidad.getText().trim()));
                    beanAccionSocio.setOperacion("I");
                }
                beanAccionSocio.setBeanSocio(beanSocio);
                ((FormAccionSocio) dialogPadre).setValueSearch(beanAccionSocio, comp);
                dispose();
            } else {
                JOptionPane.showMessageDialog(this, "Seleccione un registro de la tabla");
            }
        }

        if (e.getSource() == btnRefrescar) {
            cargarTabla();
        }
        if (e.getSource() == btnCancelar) {
            dispose();
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_codigo) {
            txt_codigo.selectAll();
        }
        if (e.getSource() == txt_numero) {
            txt_numero.selectAll();
        }
        if (e.getSource() == txt_descripcion) {
            txt_descripcion.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_codigo)) {
                filtrar();
            }
            if ((e.getSource() == txt_numero)) {
                filtrar();
            }
            if ((e.getSource() == txt_descripcion)) {
                filtrar();
            }
        }
    }
}
