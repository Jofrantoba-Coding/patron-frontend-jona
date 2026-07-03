/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregistersocio;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Socio;
import com.softcommerce.beans.BeanTipoDocIden;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnCliente;
import com.softcommerce.reglasnegocio.RnTipoDocIden;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dialog;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;

/**
 *
 * @author Team Develtrex
 */
public class UiRegisterSocio extends JHDialog implements InterUiRegisterSocio, ActionListener, ItemListener, KeyListener, WindowListener, MouseListener, FocusListener, TableModelListener, ListSelectionListener {

    protected Usuario usuario;
    protected Gif gif;
    protected JTabbedPane tabb;
    protected JTextField txt_Codigo;
    protected JComboBox cbo_TipoDocIden;
    protected List<BeanTipoDocIden> xTipoDocIden;
    protected JTextField txt_NumDoc;
    protected JTextField txt_ApePaterno;
    protected JTextField txt_ApeMaterno;
    protected JTextField txt_Nombre;
    protected JTextField txt_Descripcion;
    protected JLabel lbl_Descripcion;
    protected JCheckBox chkEstado;

    public UiRegisterSocio(Frame arg0, Usuario usuario) {
        super(arg0, true);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    public UiRegisterSocio(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    protected void inicialize() {
        addWindowListener(this);
        gif = new Gif();

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));

        tabb = new JTabbedPane();
        tabb.addKeyListener(this);
        tabb.addFocusListener(this);

        tabb.addTab("General", getPanelDatosGeneral());

        //pnl_dialog.add(tabb);

        //tabb.setBounds(10, 10, 815, 430);
        pnl_dialog.add(tabb, BorderLayout.CENTER);

        setTitleName("Socio");
        setRegister(pnl_dialog);
        setSize(new Dimension(700, 400));
        ComponentToolKit.centerComponentPosicion(this);
        //pack();
    }

    protected void initListener() {
    }

    protected JPanel getPanelDatosGeneral() {
        JPanel pnlGeneral = new JPanel();
        pnlGeneral.setLayout(new GridBagLayout());
        pnlGeneral.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = new GridBagConstraints();
        JLabel lbl_Codigo = new JLabel("Código");
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Codigo, gbc);

        txt_Codigo = new JTextField();
        txt_Codigo.setEnabled(false);
        txt_Codigo.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Codigo, gbc);

        JLabel lbl_TipoDocIden = new JLabel("Tipo de Documento");
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_TipoDocIden, gbc);

        cbo_TipoDocIden = new JComboBox();
        cbo_TipoDocIden.setFont(new Font(Font.SANS_SERIF, 0, 9));
        //cb_TipoDocIden.addKeyListener(this);estaba activado
        cbo_TipoDocIden.addActionListener(this);
        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(cbo_TipoDocIden, gbc);

        JLabel lbl_NumDoc = new JLabel("DNI/RUC");
        gbc.gridx = 2;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_NumDoc, gbc);

        txt_NumDoc = new JTextField();
        txt_NumDoc.setDocument(new IntegerDocument(11));
        //txt_NumDoc.setMaximumSize(new Dimension(100,20));
        txt_NumDoc.addFocusListener(this);
        txt_NumDoc.addKeyListener(this);
        txt_NumDoc.setColumns(10);
        gbc.gridx = 3;
        gbc.gridy = 1;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_NumDoc, gbc);

        JLabel lbl_ApePaterno = new JLabel("Apellido Paterno");
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_ApePaterno, gbc);
        txt_ApePaterno = new JTextField();
        txt_ApePaterno.addFocusListener(this);
        txt_ApePaterno.setDocument(new UpperCaseDocument(50));
        txt_ApePaterno.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_ApePaterno, gbc);
        JLabel lbl_ApeMaterno = new JLabel("Apellido Materno");
        gbc.gridx = 2;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_ApeMaterno, gbc);
        txt_ApeMaterno = new JTextField();
        txt_ApeMaterno.setDocument(new UpperCaseDocument(50));
        txt_ApeMaterno.addFocusListener(this);
        txt_ApeMaterno.addKeyListener(this);
        gbc.gridx = 3;
        gbc.gridy = 2;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_ApeMaterno, gbc);
        JLabel lbl_Nombre = new JLabel("Nombres");
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Nombre, gbc);
        txt_Nombre = new JTextField();
        txt_Nombre.addFocusListener(this);
        txt_Nombre.setDocument(new UpperCaseDocument(50));
        txt_Nombre.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Nombre, gbc);

        lbl_Descripcion = new JLabel("Razón Social");
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(lbl_Descripcion, gbc);
        txt_Descripcion = new JTextField();
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(300));
        gbc.gridx = 1;
        gbc.gridy = 4;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(txt_Descripcion, gbc);

        chkEstado = new JCheckBox("Estado");
        chkEstado.setEnabled(false);
        gbc.gridx = 2;
        gbc.gridy = 3;
        gbc.fill = GridBagConstraints.BOTH;
        gbc.insets = new Insets(5, 5, 5, 5);
        pnlGeneral.add(chkEstado, gbc);

        return pnlGeneral;
    }

    protected void loadTipoDocIden() throws Exception {
    }

    protected Socio llenarBeanSocio() {
        Socio beanSocio = new Socio();
        //SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
        beanSocio.setId_socio((txt_Codigo.getText().trim().length() > 0 ? Integer.parseInt(txt_Codigo.getText().trim()) : 0));
        String flag_tipo_persona = "N";
        char val = txt_NumDoc.getText().charAt(0);
        flag_tipo_persona = (xTipoDocIden.get(cbo_TipoDocIden.getSelectedIndex() - 1).getId_tipo_doc().equals("05") && val == '2') ? "J" : "N";
        beanSocio.setFlag_tipo_persona(flag_tipo_persona);
        beanSocio.setPaterno(txt_ApePaterno.getText().trim());
        beanSocio.setMaterno(txt_ApeMaterno.getText().trim());
        beanSocio.setNombres(txt_Nombre.getText().trim());
        beanSocio.setDescripcion(txt_Descripcion.getText().trim());
        BeanTipoDocIden beanTDV = new BeanTipoDocIden();
        beanTDV.setId_tipo_doc(cbo_TipoDocIden.getSelectedIndex() > 0 ? xTipoDocIden.get(cbo_TipoDocIden.getSelectedIndex() - 1).getId_tipo_doc() : "");
        beanSocio.setTipo_doc(beanTDV);
        beanSocio.setNumero(txt_NumDoc.getText().trim());
        beanSocio.setEstado(chkEstado.isSelected() ? "A" : "D");
        beanSocio.setId_usuario(usuario.getId_usuario());

        return beanSocio;
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setRegisterEnabled(boolean flag) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void setRegisterEditable(boolean flag) {
        cbo_TipoDocIden.setEnabled(flag);
        txt_NumDoc.setEditable(flag);
        txt_ApePaterno.setEditable(flag);
        txt_ApeMaterno.setEditable(flag);
        txt_Nombre.setEditable(flag);
        txt_Descripcion.setEditable(flag);
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbo_TipoDocIden == e.getSource()) {
            if (cbo_TipoDocIden.getSelectedIndex() == 0) {
                txt_NumDoc.setEnabled(false);
                txt_ApePaterno.setEnabled(false);
                txt_ApeMaterno.setEnabled(false);
                txt_Nombre.setEnabled(false);
                txt_Descripcion.setEnabled(false);
            } else if (String.valueOf(cbo_TipoDocIden.getSelectedItem()).equalsIgnoreCase("DNI")) {
                txt_ApePaterno.setEnabled(true);
                txt_ApeMaterno.setEnabled(true);
                txt_Nombre.setEnabled(true);
                txt_Descripcion.setEnabled(false);
                txt_NumDoc.setEnabled(true);
                txt_NumDoc.setDocument(new IntegerDocument(8));
                lbl_Descripcion.setVisible(false);
                txt_Descripcion.setVisible(false);
                txt_NumDoc.requestFocus();
            } else if (String.valueOf(cbo_TipoDocIden.getSelectedItem()).equalsIgnoreCase("RUC")) {
                txt_ApePaterno.setEnabled(false);
                txt_ApeMaterno.setEnabled(false);
                txt_Nombre.setEnabled(false);
                txt_Descripcion.setEnabled(true);
                txt_NumDoc.setEnabled(true);
                txt_NumDoc.setDocument(new IntegerDocument(11));
                lbl_Descripcion.setVisible(true);
                txt_Descripcion.setVisible(true);
                txt_NumDoc.requestFocus();
            } else {
                txt_ApePaterno.setEnabled(false);
                txt_ApeMaterno.setEnabled(false);
                txt_Nombre.setEnabled(false);
                txt_Descripcion.setEnabled(true);
                txt_NumDoc.setEnabled(true);
                txt_NumDoc.setDocument(new IntegerDocument(11));
                lbl_Descripcion.setVisible(true);
                txt_Descripcion.setVisible(true);
                txt_NumDoc.requestFocus();
            }
            txt_ApeMaterno.setText(null);
            txt_ApePaterno.setText(null);
            txt_Nombre.setText(null);
            txt_Descripcion.setText(null);
            txt_NumDoc.setText(null);
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getSource() == txt_NumDoc) {
            if (String.valueOf(cbo_TipoDocIden.getSelectedItem()).equalsIgnoreCase("RUC")) {
                if (txt_NumDoc.getText().length() == 1 || txt_NumDoc.getText().length() == 11) {
                    char val = txt_NumDoc.getText().charAt(0);
                    if (val == '1') {
                        txt_ApePaterno.setEnabled(true);
                        txt_ApeMaterno.setEnabled(true);
                        txt_Nombre.setEnabled(true);
                        txt_Descripcion.setEnabled(false);
                        lbl_Descripcion.setVisible(false);
                        txt_Descripcion.setVisible(false);
                    } else if (val == '2') {
                        txt_ApePaterno.setEnabled(false);
                        txt_ApeMaterno.setEnabled(false);
                        txt_Nombre.setEnabled(false);
                        txt_Descripcion.setEnabled(true);
                        lbl_Descripcion.setVisible(true);
                        txt_Descripcion.setVisible(true);
                        txt_NumDoc.requestFocus();
                    } else {
                        JOptionPane.showMessageDialog(null, "EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2");
                        txt_ApePaterno.setEnabled(false);
                        txt_ApeMaterno.setEnabled(false);
                        txt_Nombre.setEnabled(false);
                        txt_Descripcion.setEnabled(true);
                        lbl_Descripcion.setVisible(true);
                        txt_Descripcion.setVisible(true);
                        txt_NumDoc.setText(null);
                    }
                }
            }
        }

        if (e.getSource() == txt_ApeMaterno || e.getSource() == txt_ApePaterno || e.getSource() == txt_Nombre) {
            String descripcionT = txt_ApePaterno.getText().trim() + " " + txt_ApeMaterno.getText().trim() + " " + txt_Nombre.getText().trim();
            txt_Descripcion.setText(descripcionT);
        }

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
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_NumDoc) {
            if (String.valueOf(cbo_TipoDocIden.getSelectedItem()).equalsIgnoreCase("RUC")) {
            }
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
    }
}
