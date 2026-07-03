package com.softcommerce.views.uipnlactualizaralmacenes;

import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.MouseEvent;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.table.DefaultTableModel;
import org.jdesktop.swingx.decorator.HighlighterFactory;
import org.jdesktop.swingx.JXTable;

public class UiPnlActualizarAlmacenesImpl extends UiPnlActualizarAlmacenes {

    public UiPnlActualizarAlmacenesImpl(Usuario user, Main frm) {
        super(user, frm);
    }
}
