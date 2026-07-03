/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformconfigpadronproveedor;


import com.softcommerce.gui.*;
import com.softcommerce.comboboxmodel.ComboModelPadron;
import com.softcommerce.entity.Anexo;
import com.softcommerce.entity.PadronProveedor;
import com.softcommerce.entity.Padrones;
import com.softcommerce.formularios.RegisterProveedor;
import com.softcommerce.logic.LogicPadronProveedor;
import com.softcommerce.logic.LogicPadrones;
import com.softcommerce.util.Propiedad;
import com.toedter.calendar.JDateChooser;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.*;

/**
 *
 * @author root
 */
public class UiFormConfigPadronProveedor extends JPanel  implements InterUiFormConfigPadronProveedor {

    protected JLabel lblId;
    protected JTextField txtid;
    protected JLabel lblFechaInicio;
    protected JDateChooser dc_fechainicio;
    protected JLabel lblTipoOper;
    protected JComboBox cboTipoOper;
    protected JButton btnProcess;
    protected ComboModelPadron cboModelPadron;
    protected String codigoCliente;
    protected RegisterProveedor register;

    public UiFormConfigPadronProveedor(String paramCodigoItem,RegisterProveedor paramregister) {
        register=paramregister;
        codigoCliente = paramCodigoItem;
        initComponents();
    }

    protected void initComponents() {
    }
    ActionListener actionListener = new ActionListener() {

        @Override
        public void actionPerformed(ActionEvent ae) {
            try {
                Propiedad p = new Propiedad();
                LogicPadronProveedor lci = new LogicPadronProveedor(p.getDbSys());
                Propiedad p2 = new Propiedad();
                LogicPadronProveedor lci2 = new LogicPadronProveedor(p2.getDbSys());
                PadronProveedor bean = new PadronProveedor();
                java.util.Date fechaini = dc_fechainicio.getDate();
                java.sql.Date ini = new java.sql.Date(fechaini.getTime());
                bean.setIdPadronProveedor(null);
                bean.setFechaIni(ini);
                bean.setEstado(true);
                Anexo anex=new Anexo();
                anex.setIdAnexo(codigoCliente);
                bean.setAnexo(anex);
                bean.setPadrones(((ComboModelPadron)cboTipoOper.getModel()).getElement(cboTipoOper.getSelectedIndex()));
                bean.setTipoOperacion("I");
                String msg=lci.mantPadronProveedor(bean);
                JOptionPane.showMessageDialog(null, msg);  
                register.getFormConfigPadron().getTableModelConfigPadron().setData(lci2.listPadronProveedor(codigoCliente));
                register.getFormConfigPadron().getTableModelConfigPadron().fireTableDataChanged();
            } catch (ArrayIndexOutOfBoundsException ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.fillInStackTrace()+"\n"+"Seleccione un padrón");
            }catch (ClassNotFoundException ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (InstantiationException ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (IllegalAccessException ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (Exception ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
                JOptionPane.showMessageDialog(null, ex.getMessage());
            }
        }
    };
}
