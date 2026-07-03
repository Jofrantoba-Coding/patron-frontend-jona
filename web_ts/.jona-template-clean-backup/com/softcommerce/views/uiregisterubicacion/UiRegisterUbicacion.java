package com.softcommerce.views.uiregisterubicacion;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAlmacen;
import com.softcommerce.beans.BeanLocalidad;
import com.softcommerce.beans.BeanPuntoVenta;
import com.softcommerce.beans.BeanUbicacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnUbicacion;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import javax.swing.JPanel;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import javax.swing.BorderFactory;
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Frame;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import javax.swing.JTextField;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.Util;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.BorderLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import org.apache.log4j.Logger;

public class UiRegisterUbicacion
        extends JHDialog implements InterUiRegisterUbicacion, ItemListener, FocusListener {

    protected JTextField txtCodigo;
    protected JTextField txtDescripcion;
    protected CComboBox cboLocalidad;
    protected final Usuario usuario;
    protected CComboBox cboPuntoVenta;
    protected CComboBox cboAlmacen;
    protected final Logger logger = Logger.getLogger(UiRegisterUbicacion.class);

    public UiRegisterUbicacion(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        setRegister(this.getPnlPrincipal());
        this.initListener();
        setTitleName("Ubicación");
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void initListener() {
        txtDescripcion.addFocusListener(this);
        cboLocalidad.addItemListener(this);
        cboPuntoVenta.addItemListener(this);
    }

    protected JPanel getPnlPrincipal() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        pnlPrinc.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Ubicacion", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnlPrinc.setBorder(border);
        JPanel pnl = new JPanel(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = LayoutUtil.getGbc();

        JLabel lblCodigo = new JLabel("Código");
        pnl.add(lblCodigo, gbc);

        gbc.gridx = 1;
        txtCodigo = new JTextField();
        txtCodigo.setColumns(5);
        txtCodigo.setEditable(false);
        pnl.add(txtCodigo, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblLocalidad = new JLabel("Localidad");
        pnl.add(lblLocalidad, gbc);

        gbc.gridx = 1;
        cboLocalidad = new CComboBox();
        pnl.add(cboLocalidad, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblPuntoVenta = new JLabel("Punto de Venta");
        pnl.add(lblPuntoVenta, gbc);

        gbc.gridx = 1;
        cboPuntoVenta = new CComboBox();
        pnl.add(cboPuntoVenta, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblAlmacen = new JLabel("Almacen");
        pnl.add(lblAlmacen, gbc);

        gbc.gridx = 1;
        cboAlmacen = new CComboBox();
        pnl.add(cboAlmacen, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lblDescripcion = new JLabel("Descripción");
        pnl.add(lblDescripcion, gbc);

        gbc.gridx = 1;
        txtDescripcion = new JTextField();
        txtDescripcion.setDocument(new UpperCaseNumberDocument(50));
        txtDescripcion.setColumns(15);
        pnl.add(txtDescripcion, gbc);

        return pnlPrinc;
    }

    protected void changeLocalidad() throws Exception {
    }

    protected void changePuntoVenta() throws Exception {
    }

    protected BeanUbicacion getUbicacion() {
        return null;
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    protected void setComboItem(String idItem, JComboBox cbo) {
        for (int i = 0; i < cbo.getItemCount(); i++) {
            ObjectItem objItem = (ObjectItem) cbo.getItemAt(i);
            if (objItem == null || objItem.getObjItem() == null) {
                continue;
            }
            if (objItem.getObjItem().toString().equals(idItem)) {
                cbo.setSelectedIndex(i);
                break;
            }
        }
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
    public void setRegisterEnabled(boolean e) {
        cboLocalidad.setEnabled(e);
        cboPuntoVenta.setEnabled(e);
        cboAlmacen.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txtDescripcion.setEditable(e);
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
    public void showMessageErrorInsert() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        try {
            if (e.getSource().equals(cboLocalidad)) {
                this.changeLocalidad();
            }
            if (e.getSource().equals(cboPuntoVenta)) {
                this.changePuntoVenta();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }
}
