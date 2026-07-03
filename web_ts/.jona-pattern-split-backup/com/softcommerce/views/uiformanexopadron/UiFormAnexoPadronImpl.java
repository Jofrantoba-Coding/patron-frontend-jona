package com.softcommerce.views.uiformanexopadron;

import com.softcommerce.beans.AnexoPadron;
import com.softcommerce.comboboxmodel.ComboModelPadron;
import com.softcommerce.entity.Padrones;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.tablas.AnexoPadronTableModel;
import com.softcommerce.logic.LogicPadrones;
import com.softcommerce.util.Propiedad;
import com.toedter.calendar.JDateChooser;
import java.awt.Color;
import java.awt.Component;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.ArrayList;
import javax.swing.border.LineBorder;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

public class UiFormAnexoPadronImpl extends UiFormAnexoPadron {

    public UiFormAnexoPadronImpl(JHDialog arg0, java.net.URL path, Component comp, int id_tipo_anexo, AnexoPadronTableModel modelAnexoPadron) {
        super(arg0, path, comp, id_tipo_anexo, modelAnexoPadron);
    }
}
