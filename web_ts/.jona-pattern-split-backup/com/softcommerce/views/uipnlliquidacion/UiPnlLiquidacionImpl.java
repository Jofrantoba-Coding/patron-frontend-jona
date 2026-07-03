package com.softcommerce.views.uipnlliquidacion;

import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.Liquidacion;
import com.softcommerce.beans.Usuario;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnLiquidacion;
import com.softcommerce.reglasnegocio.RnUsuario;
import com.softcommerce.report.reporte_v3;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.Font;
import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import org.japura.gui.SplitButton;
import org.jdesktop.swingx.decorator.HighlighterFactory;
import org.jdesktop.swingx.JXDatePicker;
import org.jdesktop.swingx.JXTable;

public class UiPnlLiquidacionImpl extends UiPnlLiquidacion {

    public UiPnlLiquidacionImpl(URL path, Usuario user, Main frm) {
        super(path, user, frm);
    }
}
