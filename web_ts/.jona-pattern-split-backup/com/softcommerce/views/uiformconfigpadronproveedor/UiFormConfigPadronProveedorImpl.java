package com.softcommerce.views.uiformconfigpadronproveedor;


import com.softcommerce.comboboxmodel.ComboModelPadron;
import com.softcommerce.entity.Anexo;
import com.softcommerce.entity.Padrones;
import com.softcommerce.entity.PadronProveedor;
import com.softcommerce.formularios.RegisterProveedor;
import com.softcommerce.gui.*;
import com.softcommerce.logic.LogicPadrones;
import com.softcommerce.logic.LogicPadronProveedor;
import com.softcommerce.util.Propiedad;
import com.toedter.calendar.JDateChooser;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.*;
public class UiFormConfigPadronProveedorImpl extends UiFormConfigPadronProveedor {

    public UiFormConfigPadronProveedorImpl(String paramCodigoItem,RegisterProveedor paramregister) {
        super(paramCodigoItem, paramregister);
    }
}
