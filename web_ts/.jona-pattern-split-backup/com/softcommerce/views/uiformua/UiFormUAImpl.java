package com.softcommerce.views.uiformua;


import com.softcommerce.beans.Usuario;
import com.softcommerce.comboboxmodel.ComboModelCorrelativo;
import com.softcommerce.comboboxmodel.ComboModelPuntoVenta;
import com.softcommerce.comboboxmodel.ComboModelTipoDoc;
import com.softcommerce.entity.AutorizarCorrelativo;
import com.softcommerce.entity.PuntoVenta;
import com.softcommerce.entity.TipoDocVenta;
import com.softcommerce.gui.*;
import com.softcommerce.logic.LogicAutorizaCorrelativo;
import com.softcommerce.logic.LogicCorrelativo;
import com.softcommerce.logic.LogicPuntoVenta;
import com.softcommerce.logic.LogicTipoDocumentoVenta;
import com.toedter.calendar.JDateChooser;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JOptionPane;
public class UiFormUAImpl extends UiFormUA {

    public UiFormUAImpl(java.awt.Dialog parent, boolean modal,java.net.URL ruta, Usuario beanUsuario) {
        super(parent, modal, ruta, beanUsuario);
    }
}
